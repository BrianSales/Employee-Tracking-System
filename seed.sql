CREATE TABLE `employee_db`.`departments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NULL,
  PRIMARY KEY (`id`));


  CREATE TABLE `employee_db`.`roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(30) NULL,
  `salary` DECIMAL(9,2) NULL,
  `department_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `department_id_idx` (`department_id` ASC) VISIBLE,
  CONSTRAINT `fk_department_id`
    FOREIGN KEY (`department_id`)
    REFERENCES `employee_db`.`departments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
