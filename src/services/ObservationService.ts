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
      // 1. Process Species Grouping
      const commonSearch = observationData.animalNickname || observationData.scientificName || 'Unknown Species';
      const scientificSearch = observationData.scientificName;

      let speciesMatch;
      if (scientificSearch && scientificSearch !== commonSearch) {
        speciesMatch = realm.objects(SpeciesRecord)
          .filtered('commonName ==[c] $0 OR scientificName ==[c] $1', commonSearch, scientificSearch)[0];
      } else {
        speciesMatch = realm.objects(SpeciesRecord)
          .filtered('commonName ==[c] $0', commonSearch)[0];
      }

      if (!speciesMatch) {
        speciesMatch = realm.create(SpeciesRecord, {
          speciesId: Crypto.randomUUID(),
          commonName: commonSearch,
          scientificName: observationData.scientificName,
          isUnknown: commonSearch === 'Unknown Species',
          totalObservations: 1,
        });
      } else {
        speciesMatch.totalObservations += 1;
        // If we didn't have a scientific name before, but we have one now, we could update it (optional)
        if (!speciesMatch.scientificName && observationData.scientificName) {
          speciesMatch.scientificName = observationData.scientificName;
        }
      }

      // 2. Create Observation
      savedObservation = realm.create(Observation, {
        observationId: Crypto.randomUUID(),
        userId,
        speciesId: speciesMatch.speciesId,
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
}
