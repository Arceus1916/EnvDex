import { Realm } from '@realm/react';

export class User extends Realm.Object<User> {
  userId!: string;
  hashId!: string;
  fullName?: string;
  username!: string;
  passwordHash!: string;
  categoryTag?: string;
  createdAt!: Date;
  updatedAt!: Date;
  syncId?: string;
  syncStatus?: string;
  lastSyncedAt?: Date;
  profilePicUri?: string;

  static schema: Realm.ObjectSchema = {
    name: 'User',
    primaryKey: 'userId',
    properties: {
      userId: 'string',
      hashId: 'string',
      fullName: 'string?',
      username: 'string',
      passwordHash: 'string',
      categoryTag: 'string?',
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
      syncId: 'string?',
      syncStatus: 'string?',
      lastSyncedAt: 'date?',
      profilePicUri: 'string?',
    },
  };
}

export class SpeciesRecord extends Realm.Object<SpeciesRecord> {
  speciesId!: string;
  commonName!: string;
  scientificName?: string;
  kingdom?: string;
  phylum?: string;
  classType?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  coverMediaUri?: string;
  isUnknown!: boolean;
  totalObservations!: number;
  isFavorite!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  syncId?: string;
  syncStatus?: string;
  lastSyncedAt?: Date;

  static schema: Realm.ObjectSchema = {
    name: 'SpeciesRecord',
    primaryKey: 'speciesId',
    properties: {
      speciesId: 'string',
      commonName: 'string',
      scientificName: 'string?',
      kingdom: 'string?',
      phylum: 'string?',
      classType: 'string?', // class is a reserved word
      order: 'string?',
      family: 'string?',
      genus: 'string?',
      species: 'string?',
      coverMediaUri: 'string?',
      isUnknown: { type: 'bool', default: false },
      totalObservations: { type: 'int', default: 0 },
      isFavorite: { type: 'bool', default: false },
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
      syncId: 'string?',
      syncStatus: 'string?',
      lastSyncedAt: 'date?',
    },
  };
}

export class Observation extends Realm.Object<Observation> {
  observationId!: string;
  speciesId?: string;
  userId!: string;
  title?: string;
  animalNickname?: string;
  scientificName?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  locationText?: string;
  timestamp!: Date;
  identificationMethod?: string;
  observationTags?: string[];
  draftStatus!: boolean;
  deletedStatus!: boolean;
  recycleBinTimestamp?: Date;
  createdAt!: Date;
  updatedAt!: Date;
  media!: Realm.List<MediaAsset>;
  syncId?: string;
  syncStatus?: string;
  lastSyncedAt?: Date;

  static schema: Realm.ObjectSchema = {
    name: 'Observation',
    primaryKey: 'observationId',
    properties: {
      observationId: 'string',
      speciesId: 'string?',
      userId: 'string',
      title: 'string?',
      animalNickname: 'string?',
      scientificName: 'string?',
      notes: 'string?',
      latitude: 'double?',
      longitude: 'double?',
      locationText: 'string?',
      timestamp: { type: 'date', default: () => new Date() },
      identificationMethod: 'string?',
      observationTags: 'string[]',
      draftStatus: { type: 'bool', default: false },
      deletedStatus: { type: 'bool', default: false },
      recycleBinTimestamp: 'date?',
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
      media: 'MediaAsset[]',
      syncId: 'string?',
      syncStatus: 'string?',
      lastSyncedAt: 'date?',
    },
  };
}

export class MediaAsset extends Realm.Object<MediaAsset> {
  mediaId!: string;
  observationId!: string;
  type!: string; // 'image' | 'video'
  localUri!: string;
  thumbnailUri?: string;
  duration?: number;
  fileSize?: number;
  resolution?: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'MediaAsset',
    primaryKey: 'mediaId',
    properties: {
      mediaId: 'string',
      observationId: 'string',
      type: 'string',
      localUri: 'string',
      thumbnailUri: 'string?',
      duration: 'double?',
      fileSize: 'int?',
      resolution: 'string?',
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}

export class DraftObservation extends Realm.Object<DraftObservation> {
  draftId!: string;
  tempMediaUris?: string[];
  temporaryNotes?: string;
  temporarySpecies?: string;
  savedStep!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'DraftObservation',
    primaryKey: 'draftId',
    properties: {
      draftId: 'string',
      tempMediaUris: 'string[]',
      temporaryNotes: 'string?',
      temporarySpecies: 'string?',
      savedStep: 'string',
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
    },
  };
}

export const realmSchemas = [User, SpeciesRecord, Observation, MediaAsset, DraftObservation];
