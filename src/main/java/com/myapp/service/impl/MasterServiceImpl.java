package com.myapp.service.impl;

import com.myapp.domain.DeletePermission;
import com.myapp.domain.MaskAndObject;
import com.myapp.domain.Master;
import com.myapp.domain.PermissionVM;
import com.myapp.repository.MasterRepository;
import com.myapp.security.jwt.TokenProvider;
import com.myapp.service.MasterService;
import com.myapp.service.PermissionService;
import com.myapp.service.dto.DeletePermissionDto;
import com.myapp.service.dto.PermissionDto;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.acls.domain.BasePermission;
import org.springframework.security.acls.model.Permission;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Service
public class MasterServiceImpl implements MasterService {

    private final TokenProvider tokenProvider;

    private final PermissionService permissionService;

    private final MasterRepository masterRepository;

    public MasterServiceImpl(TokenProvider tokenProvider, PermissionService permissionService, MasterRepository masterRepository) {
        this.tokenProvider = tokenProvider;
        this.permissionService = permissionService;
        this.masterRepository = masterRepository;
    }

    @Override
    @PreAuthorize("hasPermission(#master, 'CREATE') or hasPermission(#master, 'ADMINISTRATION') or hasAuthority('ROLE_ADMIN')")
    public Master save(Master master) {
        master.setId(null);
        master = masterRepository.save(master);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        if (master != null) {
            permissionService.addPermissionForUser(master, BasePermission.ADMINISTRATION, userName);
        }

        return master;
    }

    @Override
    @PreAuthorize("hasPermission(#master, 'WRITE') or hasPermission(#master, 'ADMINISTRATION') or hasAuthority('ROLE_ADMIN')")
    public Optional<Master> partialUpdate(Master master) {
        Master master1 = masterRepository.save(master);
        Optional<Master> optionalMaster = Optional.ofNullable(master1);
        return optionalMaster;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Master> findAll() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        List<Master> masterList;

        if (checkPermission(authentication)) {
            masterList = masterRepository.findAll();
        } else {
            masterList = masterRepository.findAll(getMastersIds());
        }

        return masterList;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Master> findOne(Long id) {
        return masterRepository.findOneByPermission(id);
    }

    @Override
    @PostAuthorize("hasPermission(#master, 'DELETE') or hasPermission(#master, 'ADMINISTRATION') or hasAuthority('ROLE_ADMIN')")
    public void delete(Master master) {
        masterRepository.deleteById(master.getId());
    }

    private boolean checkPermission(Authentication authentication) {
        List<GrantedAuthority> authorities = new ArrayList<>(authentication.getAuthorities());
        List<String> authoritiesStrings = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        if (authentication.getName().equalsIgnoreCase("admin") || authoritiesStrings.contains("ROLE_ADMIN")) {
            return true;
        }
        return false;
    }

    private List<Long> getMastersIds() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = tokenProvider.createToken(authentication, false);

        WebClient webClient = WebClient.create("https://practice.sqilsoft.by/internship/yury_sinkevich/acl");
        Flux<MaskAndObject> employeeMap = webClient
            .get()
            .uri("/api/get-acl-entries?objE=com.myapp.domain.Master")
            .headers(
                httpHeaders -> {
                    httpHeaders.set("Authorization", "Bearer " + token);
                    httpHeaders.set("X-TENANT-ID", "maksimdb");
                }
            )
            .retrieve()
            .bodyToFlux(MaskAndObject.class);
        return employeeMap.collectList().block().stream().map(MaskAndObject::getObjId).collect(Collectors.toList());
    }

    @Override
    public void addPermissions(List<PermissionVM> permissionVMS) {
        List<PermissionDto> permissionDtos = new ArrayList<>();
        for (PermissionVM permissionVM : permissionVMS) {
            permissionDtos.add(
                new PermissionDto(
                    permissionVM.getEntityId(),
                    Master.class.getName(),
                    convertFromStringToBasePermission(permissionVM.getPermission()).getMask(),
                    permissionVM.getUserCredentional()
                )
            );
        }
        permissionService.addPermissions(permissionDtos);
    }

    @Override
    public void deletePermission(PermissionVM permissionVM) {
        DeletePermissionDto deletePermissionDto = new DeletePermissionDto();
        deletePermissionDto.setEntityId(permissionVM.getEntityId());
        deletePermissionDto.setUser(permissionVM.getUserCredentional());
        deletePermissionDto.setPermission(convertFromStringToIntPermission(permissionVM.getPermission()));
        deletePermissionDto.setEntityClassName(Master.class.getName());
        permissionService.deletePermission(deletePermissionDto);
    }

    private Permission convertFromStringToBasePermission(String permission) {
        switch (permission.toUpperCase()) {
            case "WRITE":
                return BasePermission.WRITE;
            case "ADMINISTRATION":
                return BasePermission.ADMINISTRATION;
            case "CREATE":
                return BasePermission.CREATE;
            case "DELETE":
                return BasePermission.DELETE;
            default:
                return BasePermission.READ;
        }
    }

    private int convertFromStringToIntPermission(String permission) {
        switch (permission.toUpperCase()) {
            case "WRITE":
                return 2;
            case "ADMINISTRATION":
                return 16;
            case "CREATE":
                return 4;
            case "DELETE":
                return 8;
            default:
                return 1;
        }
    }
}
