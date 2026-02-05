package com.papsnet.openissue.common.dto;

import com.papsnet.openissue.auth.dto.Person;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationTreeDTO {
    private String key;
    private String title;
    private List<Person> people;
    private List<OrganizationTreeDTO> children;
}
