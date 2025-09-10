select * from frutas;
-- MySQL Script adaptado para FrutasPepeBD
-- Fecha: Mié Sep 10 09:25:00 2025

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema FrutasPepeBD
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `FrutasPepeBD` DEFAULT CHARACTER SET utf8mb3 ;
USE `FrutasPepeBD` ;

-- -----------------------------------------------------
-- Table `FrutasPepeBD`.`Nivel_Academico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FrutasPepeBD`.`Nivel_Academico` (
  `idNivel` INT NOT NULL AUTO_INCREMENT,
  `Nivel` VARCHAR(50) NOT NULL,
  `Institucion` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`idNivel`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb3;

-- -----------------------------------------------------
-- Table `FrutasPepeBD`.`Generales`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FrutasPepeBD`.`Generales` (
  `idGeneral` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `sexo` ENUM('M', 'F') NOT NULL,
  `Nivel_Academico_idNivel` INT NOT NULL,
  PRIMARY KEY (`idGeneral`),
  INDEX `fk_Generales_Nivel_Academico1_idx` (`Nivel_Academico_idNivel` ASC),
  CONSTRAINT `fk_Generales_Nivel_Academico1`
    FOREIGN KEY (`Nivel_Academico_idNivel`)
    REFERENCES `FrutasPepeBD`.`Nivel_Academico` (`idNivel`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb3;

-- -----------------------------------------------------
-- Table `FrutasPepeBD`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FrutasPepeBD`.`user` (
  `idUSER` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(16) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `rol` ENUM('ADMIN', 'ENCARGADO', 'EMPLEADO') NOT NULL,
  `Generales_idGeneral` INT NOT NULL,
  PRIMARY KEY (`idUSER`),
  UNIQUE INDEX `UC_User_Username` (`username` ASC),
  INDEX `fk_user_Generales_idx` (`Generales_idGeneral` ASC),
  CONSTRAINT `fk_user_Generales`
    FOREIGN KEY (`Generales_idGeneral`)
    REFERENCES `FrutasPepeBD`.`Generales` (`idGeneral`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb3;

-- -----------------------------------------------------
-- Table `FrutasPepeBD`.`Proveedores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FrutasPepeBD`.`Proveedores` (
  `idProveedor` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Direccion` VARCHAR(255) NULL DEFAULT NULL,
  `Telefono` VARCHAR(20) NULL DEFAULT NULL,
  `Email` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`idProveedor`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb3;

-- -----------------------------------------------------
-- Table `FrutasPepeBD`.`Frutas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FrutasPepeBD`.`Frutas` (
  `idFruta` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Tipo` VARCHAR(50) NOT NULL,
  `Color` VARCHAR(50) NOT NULL,
  `EsTropical` TINYINT(1) NOT NULL,
  `Imagen` VARCHAR(255) NOT NULL,
  `Precio` DECIMAL(10,2) NOT NULL,
  `Proveedores_idProveedor` INT NOT NULL,
  PRIMARY KEY (`idFruta`),
  INDEX `fk_Frutas_Proveedores1_idx` (`Proveedores_idProveedor` ASC),
  CONSTRAINT `fk_Frutas_Proveedores1`
    FOREIGN KEY (`Proveedores_idProveedor`)
    REFERENCES `FrutasPepeBD`.`Proveedores` (`idProveedor`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb3;

-- -----------------------------------------------------
-- Datos de ejemplo
-- -----------------------------------------------------
INSERT INTO Nivel_Academico (Nivel, Institucion)
VALUES ('Licenciatura', 'Universidad Nacional');

INSERT INTO Generales (nombre, apellido, sexo, Nivel_Academico_idNivel)
VALUES ('Admin', 'Admin', 'M', 1);

INSERT INTO user (username, password, rol, Generales_idGeneral)
VALUES ('Admin', 'Admin', 'ADMIN', 1);

-- Insertar proveedores
INSERT INTO `FrutasPepeBD`.`Proveedores` (`Nombre`, `Direccion`, `Telefono`, `Email`) VALUES
('Frutas Tropicales S.A.', 'Calle Mango 123, San José, Costa Rica', '+506-2222-3333', 'ventas@frutastropicales.com'),
('Delicias Naturales', 'Av. Papaya 456, Lima, Perú', '+51-1-444-5555', 'contacto@delicias.pe'),
('ExportFrutas', 'Ruta 7, Mendoza, Argentina', '+54-261-555-6789', 'info@exportfrutas.com');

-- Insertar frutas
INSERT INTO `FrutasPepeBD`.`Frutas` (`Nombre`, `Tipo`, `Color`, `EsTropical`, `Imagen`, `Precio`, `Proveedores_idProveedor`) VALUES
('Mango', 'Dulce', 'Amarillo', 1, 'https://example.com/mango.jpg', 2.99, 1),
('Papaya', 'Dulce', 'Naranja', 1, 'https://example.com/papaya.jpg', 3.49, 2),
('Manzana', 'Ácida', 'Rojo', 0, 'https://example.com/manzana.jpg', 1.99, 3);

INSERT INTO `FrutasPepeBD`.`Proveedores` (`Nombre`, `Direccion`, `Telefono`, `Email`) VALUES
('Frutas del Sol', 'Km 12 Carretera Sur, Managua, Nicaragua', '+505-2278-9000', 'info@frutasdelsol.com'),
('Tropical Harvest', 'Calle 8, San Pedro Sula, Honduras', '+504-2550-1122', 'ventas@tropicalharvest.hn'),
('EcoFrutas', 'Av. Verde 101, Bogotá, Colombia', '+57-1-789-4567', 'contacto@ecofrutas.co');

INSERT INTO `FrutasPepeBD`.`Frutas` (`Nombre`, `Tipo`, `Color`, `EsTropical`, `Imagen`, `Precio`, `Proveedores_idProveedor`) VALUES
('Banano', 'Dulce', 'Amarillo', 1, 'https://example.com/banano.jpg', 0.99, 4),
('Sandía', 'Refrescante', 'Verde/Rojo', 1, 'https://example.com/sandia.jpg', 4.50, 5),
('Uva', 'Dulce', 'Morado', 0, 'https://example.com/uva.jpg', 2.75, 6),
('Piña', 'Ácida', 'Amarillo', 1, 'https://example.com/pina.jpg', 3.25, 4),
('Fresa', 'Dulce', 'Rojo', 0, 'https://example.com/fresa.jpg', 2.10, 5),
('Melón', 'Refrescante', 'Naranja', 1, 'https://example.com/melon.jpg', 3.80, 6),
('Guayaba', 'Aromática', 'Rosado', 1, 'https://example.com/guayaba.jpg', 1.95, 4),
('Maracuyá', 'Ácida', 'Amarillo', 1, 'https://example.com/maracuya.jpg', 2.60, 5);


-- Nivel académico adicional
INSERT INTO Nivel_Academico (Nivel, Institucion)
VALUES ('Sin nivel', 'N/A');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
