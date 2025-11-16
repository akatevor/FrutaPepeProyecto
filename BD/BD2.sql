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

use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://tse3.mm.bing.net/th/id/OIP.CYUynuaLGshw2MqoBoXYTAHaJ4?cb=12&pid=ImgDet&w=474&h=632&rs=1&o=7&rm=3'
WHERE idFruta = 1;


use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://tse1.mm.bing.net/th/id/OIP.I2iHw8IBHLsyO1nF0c0gZQHaEO?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
WHERE idFruta = 2;

use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://th.bing.com/th/id/R.c6ef1c7c177ba0e205add120ea606bf5?rik=v3wGpu4bFxqMtA&riu=http%3a%2f%2fwww.ibereco.com%2fimagen%2fcompleta%2f0%2f0%2fmanzana-roja-unidad_1.jpg&ehk=YYUtD01LCi9sJPys3KZ4sp83JmIlX0wQrzg79GZBO3w%3d&risl=&pid=ImgRaw&r=0'
WHERE idFruta = 3;


use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://th.bing.com/th/id/R.3ac9e7bf503ebb0e8f41b40c9ee489de?rik=rtsDJwtsFRq6yQ&riu=http%3a%2f%2fwww.infoescola.com%2fwp-content%2fuploads%2f2010%2f04%2fbanana_600797891.jpg&ehk=%2f6uRnWKgd%2b66pd5FN1cGIcy0rHs8s%2fns68JACjU9J1w%3d&risl=&pid=ImgRaw&r=0'
WHERE idFruta = 4;

use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://tse2.mm.bing.net/th/id/OIP.UZo1a-2FUhQSWc7MUe_DsQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
WHERE idFruta = 5;


use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://th.bing.com/th/id/R.17720daf50ee4d44a1a14900051d5736?rik=Ofr64sZ77wHqZA&riu=http%3a%2f%2fm.larevista.in%2fwp-content%2fuploads%2f2016%2f04%2fworldknowing.com_.jpg&ehk=i8ImI7u52sBoLW8kOOeEM7wOcJXyjkIw9mTHP0TTRm0%3d&risl=&pid=ImgRaw&r=0'
WHERE idFruta = 6;

use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://th.bing.com/th/id/R.3d142ea636a42bb7f257c53ff2367cfe?rik=Lgz5DsZwnbB6fQ&riu=http%3a%2f%2fvisionagropecuaria.com.ve%2fwp-content%2fuploads%2f2016%2f09%2fMelon.png&ehk=sVDUZindNgo%2fAsorPb1hpb%2b783Jy9STGdRKVJOrPPnc%3d&risl=&pid=ImgRaw&r=0'
WHERE idFruta = 9;


use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://tse4.mm.bing.net/th/id/OIP.JSC-abLl-eP6ibfuwmncAQHaF7?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
WHERE idFruta = 8;


use FrutasPepeBD;
UPDATE Frutas
SET Imagen = 'https://tse1.mm.bing.net/th/id/OIP.zrjLwr2uCxOlBn1WtqhOigHaGh?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3'
WHERE idFruta = 11;






-- Nivel académico adicional
INSERT INTO Nivel_Academico (Nivel, Institucion)
VALUES ('Sin nivel', 'N/A');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
