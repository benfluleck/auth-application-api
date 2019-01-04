import uuid from 'uuid';
import Redis from 'ioredis';


const redis = new Redis();

export const createConfirmEmailLink = async (currentUrl, userId) => {
  const id = uuid.v4();
  await redis.set(id, userId, "ex", 60 * 60 * 24)
  return `${currentUrl}/confirm/${id}`
}
