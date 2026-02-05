package com.papsnet.openissue.auth.controller;

import com.papsnet.openissue.auth.dto.GroupMember;
import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.service.PersonService;
import com.papsnet.openissue.common.dto.CommonResult;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.dto.OrganizationTreeDTO;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@Tag(name = "사용자 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class PersonController {

    private final PersonService personService;
    private final ResponseService responseService;

    @Operation(summary = "사용자 목록 조회", description = "검색 조건으로 사용자 목록을 조회합니다.")
    @PostMapping("/users")
    public ListResult<Person> persons(@RequestBody Person cond){
        System.out.println("[PersonController, persons, api/v1/users]");
        return responseService.getListResult(personService.selPersons(cond));
    }

    @Operation(summary = "그룹 멤버 조회", description = "그룹 UID로 소속 사용자 목록을 조회합니다.")
    @PostMapping("/user/group/members/{grpUid}")
    public ListResult<Person> selGroupMembers(@PathVariable("grpUid") Long grpUid) {
        return responseService.getListResult(personService.selGroupMembers(grpUid));
    }

    @Operation(summary = "조직도 조회", description = "조직 트리와 부서별 인원을 조회합니다.")
    @GetMapping("/organization")
    public DataResult<OrganizationTreeDTO> selOrganization() {
        try {
            return responseService.getDataResult(personService.selPersonWithOrganization());
        } catch (Exception e) {
            log.info("Cause >> " + e.getCause().toString());
            throw new CBizProcessFailException("조직도 검색 실패");
        }
    }

    @Operation(summary = "사용자 상세 조회", description = "사용자 정보를 조회합니다.")
    @PostMapping("/user/{oid}")
    public DataResult<Person> person(
            @Parameter(description = "사용자 키") @PathVariable int oid,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ){
        Person cond = new Person();
        cond.setOid(oid);
        Person result = personService.selPerson(cond);

        return responseService.getDataResult(result);
    }

    // region Legacy-compatible endpoints
    @Operation(summary = "사용자 등록", description = "신규 사용자를 등록하고 생성된 OID를 반환합니다.")
    @PostMapping("/user/insert")
    public DataResult<Integer> insPerson(
            @RequestBody Person param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            Integer oid = personService.insPerson(reqUserUid, param);
            if (oid != null && oid == -1) {
                return responseService.getDataResult(-1, "ID가 중복입니다.", -1);
            }
            return responseService.getDataResult(oid);
        } catch (Exception ex) {
            return responseService.getDataResult(-1, ex.getMessage(), null);
        }
    }

    @Operation(summary = "사용자 정보 수정", description = "사용자 기본 정보 및 연결된 DObject 정보를 수정합니다.")
    @PostMapping("/user/update")
    public CommonResult udtPerson(
            @RequestBody Person param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            personService.udtPerson(reqUserUid, param);
            return responseService.getSuccessResult();
        } catch (Exception ex) {
            return responseService.getFailResult(-1, ex.getMessage());
        }
    }

    @Operation(summary = "사용자 비밀번호 변경", description = "비밀번호를 변경합니다. 값이 없으면 기본 비밀번호로 초기화합니다.")
    @PostMapping("/user/password/update")
    public CommonResult udtPwPerson(
            @RequestBody Person param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            personService.udtPwPerson(param);
            return responseService.getSuccessResult();
        } catch (Exception ex) {
            return responseService.getFailResult(-1, ex.getMessage());
        }
    }

    @Operation(summary = "사용자 조회", description = "부서 조건에 따라 사용자 목록을 조회합니다. 회사 레벨 선택 시 전체 조회합니다.")
    @PostMapping("/user/sel")
    public ListResult<Person> selPersons(
            @RequestBody Person param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(personService.selPersonsWithDeptLogic(param));
    }

    @Operation(summary = "사용자 삭제", description = "사용자를 삭제합니다. 내부적으로 DObject 삭제를 수행합니다.")
    @PostMapping("/user/delete")
    public CommonResult delPerson(
        @RequestBody Person param,
        @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            personService.delPerson(reqUserUid, param);
            return responseService.getSuccessResult();
        } catch (Exception ex) {
            return responseService.getFailResult(-1, ex.getMessage());
        }
    }
    // endregion
}
