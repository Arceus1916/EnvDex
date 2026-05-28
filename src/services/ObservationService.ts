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
      speciesName: string; // The user input for species
    }
  ): Promise<Observation> {
    const draft = realm.objectForPrimaryKey(DraftObservation, draftId);
    if (!draft) {
      throw new Error('Draft not found.');
    }

    let savedObservation!: Observation;

    realm.write(() => {
      // 1. Process Species Grouping
      let speciesMatch = realm.objects(SpeciesRecord)
        .filtered('commonName ==[c] $0', observationData.speciesName)[0];

      if (!speciesMatch) {
        speciesMatch = realm.create(SpeciesRecord, {
          speciesId: Crypto.randomUUID(),
          commonName: observationData.speciesName,
          isUnknown: observationData.speciesName.trim() === '',
          totalObservations: 1,
        });
      } else {
        speciesMatch.totalObservations += 1;
      }

      // 2. Create Observation
      savedObservation = realm.create(Observation, {
        observationId: Crypto.randomUUID(),
        userId,
        speciesId: speciesMatch.speciesId,
        title: observationData.title,
        notes: observationData.notes,
        latitude: observationData.latitude,
        longitude: observationData.longitude,
        locationText: observationData.locationText,
        timestamp: new Date(),
        draftStatus: false,
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
