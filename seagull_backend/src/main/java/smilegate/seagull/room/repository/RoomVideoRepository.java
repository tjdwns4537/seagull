package smilegate.seagull.room.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public class RoomVideoRepository {
    private final static String ROOMVIDEO = "ROOM_VIDEO:";

    private final RedisTemplate<String, String> redisTemplate;
    private static SetOperations<String, String> setData; // 참가자 리스트

    private static ListOperations<String, String> listData;

    @Autowired
    public RoomVideoRepository(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        setData = redisTemplate.opsForSet();
        listData = redisTemplate.opsForList();
    }

    public void setURL(String roomLink, String userId){
        listData.leftPush(ROOMVIDEO+roomLink, userId);
    }

    public Set<String> getUrlAll(String roomLink) {
        return setData.members(ROOMVIDEO+roomLink);
    }

    public void deleteUrl(String roomLink, String userId) {
        setData.remove(ROOMVIDEO + roomLink, userId);
    }

    public void deleteUrlAll(String roomLink) {
        redisTemplate.delete(ROOMVIDEO + roomLink);
    }

    public String findByRoomLink(String roomLink) {
        Boolean check = redisTemplate.hasKey(ROOMVIDEO + roomLink);
        if(!check) return "";
        String popData = listData.leftPop(ROOMVIDEO+roomLink);
        listData.leftPush(ROOMVIDEO+roomLink, popData);
        return popData;
    }

    public Boolean existVideo(String roomLink) {
        return redisTemplate.hasKey(ROOMVIDEO+roomLink);
    }
}

