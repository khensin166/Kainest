import { CoupleEntity } from "../../domain/entities/CoupleEntity";
import { PartnerEntity } from "../../domain/entities/PartnerEntity";

/**
 * Memetakan respons API dari GET /couple
 * @param {object} apiResponse - Respons mentah dari API
 * @returns {CoupleEntity}
 */
export function mapCoupleFromApi(apiResponse) {
  // Kasus 1: Belum terhubung
  if (!apiResponse.connected || !apiResponse.data) {
    return new CoupleEntity({ connected: false });
  }

  // Kasus 2: Sudah terhubung
  const { data } = apiResponse;
  const partnerData = data.partner;

  // 'partner' di dalam 'data' sudah bersih,
  // tapi kita tetap map untuk memastikan konsistensi
  const partnerEntity = new PartnerEntity({
    id: partnerData.id,
    name: partnerData.name,
    displayName: partnerData.displayName,
    avatarUrl: partnerData.avatarUrl,
  });

  return new CoupleEntity({
    connected: true,
    coupleId: data.coupleId,
    partner: partnerEntity,
    createdAt: data.createdAt,
  });
}
