package com.papsnet.openissue.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class FolderResult<T> {
    @JsonProperty("key")
    private String key;

    @JsonProperty("title")
    private String title;

    @JsonProperty("type")
    private String type;

    @JsonProperty("data")
    private T data;

    @JsonProperty("children")
    private List<FolderResult<T>> children;
}
