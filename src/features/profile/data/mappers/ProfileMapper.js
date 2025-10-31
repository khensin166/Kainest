import { ProfileEntity } from "../../domain/entities/ProfileEntity";

/**
 * Memetakan respons API (nested) ke ProfileEntity (flat)
 * @param {object} apiResponse - Objek 'profile' dari respons JSON
 * @returns {ProfileEntity}
 */
export function mapProfileFromApi(apiResponse) {
  if (!apiResponse) return null;

  return new ProfileEntity({
    id: apiResponse.id,
    email: apiResponse.email,
    name: apiResponse.name,
    phoneNumber: apiResponse.phone_number,
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt,
    // Ambil dari sub-objek 'profile'
    profileId: apiResponse.profile?.id,
    displayName: apiResponse.profile?.displayName,
    avatarUrl: apiResponse.profile?.avatarUrl,
    invitationCode: apiResponse.profile?.invitationCode,
  });
}

/**
 * Memetakan data dari form (camelCase) ke payload API (snake_case)
 * @param {object} profileData - data dari use case
 * @returns {object} - payload JSON untuk API
 */
export function mapProfileToApi(profileData) {
  const payload = {};
  
  if (profileData.name !== undefined) {
    payload.name = profileData.name;
  }
  if (profileData.displayName !== undefined) {
    payload.displayName = profileData.displayName;
  }
  if (profileData.phoneNumber !== undefined) {
    payload.phone_number = profileData.phoneNumber;
  }
   if (profileData.avatarUrl !== undefined) {
    payload.avatarUrl = profileData.avatarUrl;
  }
  
  return payload;
}