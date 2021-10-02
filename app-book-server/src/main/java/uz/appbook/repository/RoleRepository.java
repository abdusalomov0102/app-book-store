package uz.appbook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.appbook.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

}
