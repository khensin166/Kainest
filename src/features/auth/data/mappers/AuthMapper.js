// src/features/auth/data/mappers/AuthMapper.js
import { UserEntity } from "../../domain/entities/UserEntity";

/**
 * Memetakan respons API dari `GET /profile` ke `UserEntity`
 * @param {object} apiUser - Objek 'profile' dari respons JSON
 * @returns {UserEntity}
 */
export function mapUserFromApi(apiUser) {
  if (!apiUser) return null;

  return new UserEntity({
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    phoneNumber: apiUser.phone_number,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
    profileId: apiUser.profile?.id,
    displayName: apiUser.profile?.displayName,
    avatarUrl: apiUser.profile?.avatarUrl,
    invitationCode: apiUser.profile?.invitationCode,
  });
}