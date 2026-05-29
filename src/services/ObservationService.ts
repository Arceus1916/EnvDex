import Realm from 'realm';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import { Observation, DraftObservation, MediaAsset, SpeciesRecord } from '../database/schema';

export class ObservationService {
  /**
   * Initialize a new draft when media is first captured.
   */
  static async createDraft(realm: Realm, initialMediaUris: string[]): Promise<DraftObservation> {
    const draftId = Crypto.randomUUID();
    let newDraft!: DraftObservation;

    realm.write(() => {
      newDraft = realm.create(DraftObservation, {
        draftId,
        tempMediaUris: initialMediaUris,
        savedStep: 'media_captured',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    return newDraft;
  }

  /**
   * Save an observation and link or create the species record.
   */
  static async saveObservation(
    realm: Realm,
    draftId: string,
    userId: string,
    observationData: {
      title?: string;
      notes?: string;
      latitude?: number;
      longitude?: number;
      locationText?: string;
      animalNickname?: string;
      scientificName?: string;
      observationTags?: string[];
    }
  ): Promise<Observation> {
    const draft = realm.objectForPrimaryKey(DraftObservation, draftId);
    if (!draft) {
      throw new Error('Draft not found.');
    }

    let savedObservation!: Observation;

    realm.write(() => {
      // 1. Process Species Grouping (Only by scientificName)
      const scientificSearch = observationData.scientificName;
      let targetSpeciesId: string;

      if (scientificSearch && scientificSearch.trim().length > 0) {
        // Try to merge if scientific name exists for this user
        let snSpecies = realm.objects(SpeciesRecord).filtered('scientificName ==[c] $0 AND userId == $1', scientificSearch.trim(), userId)[0];
        if (!snSpecies) {
          snSpecies = realm.create(SpeciesRecord, {
            speciesId: Crypto.randomUUID(),
            userId,
            commonName: observationData.animalNickname || observationData.title || 'Unknown Sighting',
            scientificName: scientificSearch.trim(),
            isUnknown: false,
            totalObservations: 1,
          });
        } else {
          snSpecies.totalObservations += 1;
        }
        targetSpeciesId = snSpecies.speciesId;
      } else {
        // No scientific name -> DO NOT MERGE. Create standalone record.
        const standaloneSpecies = realm.create(SpeciesRecord, {
          speciesId: Crypto.randomUUID(),
          userId,
          commonName: observationData.animalNickname || observationData.title || 'Unknown Sighting',
          scientificName: undefined,
          isUnknown: true,
          totalObservations: 1,
        });
        targetSpeciesId = standaloneSpecies.speciesId;
      }

      // 2. Create Observation
      savedObservation = realm.create(Observation, {
        observationId: Crypto.randomUUID(),
        userId,
        speciesId: targetSpeciesId,
        title: observationData.title || observationData.animalNickname,
        animalNickname: observationData.animalNickname,
        scientificName: observationData.scientificName,
        notes: observationData.notes,
        latitude: observationData.latitude,
        longitude: observationData.longitude,
        locationText: observationData.locationText,
        timestamp: new Date(),
        draftStatus: false,
        observationTags: observationData.observationTags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 3. Process Media
      // In a real scenario, we copy from cache to permanent DocumentDirectory here
      if (draft.tempMediaUris) {
        for (const uri of draft.tempMediaUris) {
          const mediaAsset = realm.create(MediaAsset, {
            mediaId: Crypto.randomUUID(),
            observationId: savedObservation.observationId,
            type: 'image',
            localUri: uri,
            createdAt: new Date(),
          });
          savedObservation.media.push(mediaAsset);
        }
      }

      // 4. Cleanup Draft
      realm.delete(draft);
    });

    return savedObservation;
  }

  /**
   * Update an existing observation, for instance adding new media or changing details.
   */
  static async updateObservation(
    realm: Realm,
    observationId: string,
    updates: {
      title?: string;
      notes?: string;
      locationText?: string;
      animalNickname?: string;
      scientificName?: string;
      observationTags?: string[];
    },
    newMediaUris?: string[]
  ): Promise<Observation> {
    const obs = realm.objectForPrimaryKey(Observation, observationId);
    if (!obs) throw new Error('Observation not found.');

    realm.write(() => {
      if (updates.title !== undefined) obs.title = updates.title;
      if (updates.notes !== undefined) obs.notes = updates.notes;
      if (updates.locationText !== undefined) obs.locationText = updates.locationText;
      if (updates.animalNickname !== undefined) obs.animalNickname = updates.animalNickname;
      if (updates.scientificName !== undefined) obs.scientificName = updates.scientificName;
      if (updates.observationTags !== undefined) obs.observationTags = updates.observationTags;
      obs.updatedAt = new Date();

      if (newMediaUris && newMediaUris.length > 0) {
        for (const uri of newMediaUris) {
          const mediaAsset = realm.create(MediaAsset, {
            mediaId: Crypto.randomUUID(),
            observationId: obs.observationId,
            type: 'image',
            localUri: uri,
            createdAt: new Date(),
          });
          obs.media.push(mediaAsset);
        }
      }
    });

    return obs;
  }
}
