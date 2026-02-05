package com.papsnet.openissue.common.dao;

import com.papsnet.openissue.common.dto.AppConfig;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Table :
 *  ST_CONFIG
 *
 */
@Mapper
public interface AppConfigDAO {
    List<AppConfig> selectConfig(AppConfig cond) throws Exception;
    String selectValueByKey(@NotNull String envKey) throws Exception;
    int saveConfig(@NonNull AppConfig data) throws Exception;
}
