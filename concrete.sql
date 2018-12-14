/*
SQLyog Enterprise - MySQL GUI v8.14 
MySQL - 5.0.37-community-nt : Database - concrete
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`concrete` /*!40100 DEFAULT CHARACTER SET latin1 */;

SET GLOBAL pxc_strict_mode=PERMISSIVE;

USE `concrete`;

/*Table structure for table `cities` */

DROP TABLE IF EXISTS `cities`;

CREATE TABLE `cities` (
  `cityName` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `cities` */

insert  into `cities`(`cityName`) values ('Mumbai'),('Indore'),('Bhopal'),('Dewas'),('Ujjain'),('Dehli');

/*Table structure for table `customersite` */

DROP TABLE IF EXISTS `customersite`;

CREATE TABLE `customersite` (
  `address` varchar(255) default NULL,
  `lon` varchar(255) default NULL,
  `lat` varchar(255) default NULL,
  `name` varchar(255) default NULL,
  `customerSiteId` int(11) NOT NULL auto_increment,
  `userId` int(11) default NULL,
  `city` varchar(255) default NULL,
  PRIMARY KEY  (`customerSiteId`),
  KEY `FK_customersite` (`userId`),
  CONSTRAINT `FK_customersite` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `customersite` */

insert  into `customersite`(`address`,`lon`,`lat`,`name`,`customerSiteId`,`userId`,`city`) values ('vijay nagar','0','0','vj',1,5,'indore'),('palasia','0','0','palasia',2,5,'indore'),('to','0','0','fji',3,14,'mumbai'),('Vijay nagar','0','0','apollo',4,5,'indore'),('Dewas','0','0','TEst',5,15,'mumbai'),('palasia','0','0','aj',6,15,'indore'),('apollo','0','0','vijay nagar ',7,16,'indore'),('address','0','0','test',8,17,'mumbai'),('MR9 indore','0','0','C21 mall',9,5,'indore'),('annapurna','0','0','muskan',10,18,'indore'),('test Address','0','0','Tester site',11,19,'mumbai'),('Test Address','75.89415','22.7439446','tesdt site',12,5,'mumbai'),('test address','75.89415','22.7439446','Test site 1',13,5,'mumbai'),('test','75.89415','22.7439446','test',14,5,'mumbai'),('test','75.89415','22.7439446','test',15,5,'mumbai'),('test','75.89415','22.7439446','test66',16,5,'mumbai'),('abcd','75.89415','22.7439446','test99',17,5,'mumbai'),('add','75.89415','22.7439446','c21',18,5,'Indore');

/*Table structure for table `dispatchorder` */

DROP TABLE IF EXISTS `dispatchorder`;

CREATE TABLE `dispatchorder` (
  `orderId` int(11) default NULL,
  `dispatchId` int(11) NOT NULL auto_increment,
  `Date` varchar(255) default NULL,
  `supplierId` int(11) default NULL,
  `requestedById` int(11) default NULL,
  `drivercontact` varchar(255) default NULL,
  PRIMARY KEY  (`dispatchId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `dispatchorder` */

insert  into `dispatchorder`(`orderId`,`dispatchId`,`Date`,`supplierId`,`requestedById`,`drivercontact`) values (64,1,'1530456789098',7,5,'8602629444'),(65,2,'1530456789098',7,6,'8602629444');

/*Table structure for table `driver` */

DROP TABLE IF EXISTS `driver`;

CREATE TABLE `driver` (
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  `pin` varchar(255) default NULL,
  `contact` varchar(255) default NULL,
  `driverId` int(11) NOT NULL auto_increment,
  `bloodGroup` varchar(255) default NULL,
  PRIMARY KEY  (`driverId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `driver` */

insert  into `driver`(`name`,`email`,`pin`,`contact`,`driverId`,`bloodGroup`) values ('abhinav muskan','ajmusk@gmail.com','$2a$10$M/kn7vA8rLMZ6QVuA39c6.KTVDCZ8TXRKMqNODrdVZM3dnJ6BwjG.','8602629444',8,'O+'),('Sarthak Jain','sarthakjain@gmail.com','$2a$10$HLH70F.autMlUXklwfylzebD2QjRSQFOsrytQuKpJiNrPdso/QZMu','8889588759',12,'B+'),('muskan jio','muskanjio@gmail.com','$2a$10$WJ/mAib9tlUKSzj9iYtO0u6f0PRT49VOKueFL3s6W8xDAZjaK2I.C','7000625124',17,'B+'),('Abhinav Juju jain','abhinavjio@gmail.com','$2a$10$ppvNTbdKDXudOd45/Ke4suZsTN5oBEtf8sc12BaZSZ0eBXnwsHKhu','8770381346',18,'O+');

/*Table structure for table `driverdetails` */

DROP TABLE IF EXISTS `driverdetails`;

CREATE TABLE `driverdetails` (
  `id` int(11) NOT NULL auto_increment,
  `driverName` varchar(255) default NULL,
  `vehicleNumber` varchar(255) default NULL,
  `contact` varchar(255) default NULL,
  `medicalDate` varchar(255) default NULL,
  `supplierId` int(11) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `driverdetails` */

insert  into `driverdetails`(`id`,`driverName`,`vehicleNumber`,`contact`,`medicalDate`,`supplierId`) values (1,'Abhinav','mp0987hgb','8602629444','156789876557',7);

/*Table structure for table `issues` */

DROP TABLE IF EXISTS `issues`;

CREATE TABLE `issues` (
  `title` varchar(255) default NULL,
  `type` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `orderId` int(11) default NULL,
  `userId` int(11) default NULL,
  `date` varchar(255) default NULL,
  `status` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `issues` */

insert  into `issues`(`title`,`type`,`description`,`orderId`,`userId`,`date`,`status`) values ('transport','3','description',2,5,'30','true'),('test','testing type','mysql test',0,0,'1530223010656','submitted to manager'),('test','testing type','mysql test',0,0,'1530262858142','submitted to manager'),('test','testing type','mysql test',0,0,'1530262976624','submitted to manager'),('test','testing type','mysql test',0,0,'1530263043509','submitted to manager'),('test','testing type','mysql test',4,5,'1530263148090','submitted to manager'),('test','testing type','mysql test',4,5,'1530300446455','submitted to manager'),('test','Quality','bad',29,5,'1531341848875','submitted to manager'),('bad ','Quality','quality not good',66,5,'1532022792204','submitted to manager'),('Bad Quality','Quality','Bad',69,5,'1532035141181','submitted to manager'),('Bad Quality','Quality','Bad',69,5,'1532035142242','submitted to manager'),('Bad','Quality','bad',69,5,'1532035561332','submitted to manager');

/*Table structure for table `multipledata` */

DROP TABLE IF EXISTS `multipledata`;

CREATE TABLE `multipledata` (
  `quoteId` int(11) default NULL,
  `quantity` varchar(255) default NULL,
  `quality` varchar(255) default NULL,
  `id` int(11) NOT NULL auto_increment,
  PRIMARY KEY  (`id`),
  KEY `quoteId` (`quoteId`),
  CONSTRAINT `multipledata_ibfk_1` FOREIGN KEY (`quoteId`) REFERENCES `quotes` (`quoteId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `multipledata` */

insert  into `multipledata`(`quoteId`,`quantity`,`quality`,`id`) values (28,'1','M',64),(28,'5','0',65),(28,'0','5',66),(29,'1234','M05',67),(29,'2345','M30',68),(29,'3456','M45',69),(29,'4567','M65',70),(29,'5678','M80',71),(30,'100','M05',72),(30,'200','M25',73),(30,'300','M7.5',74),(30,'210','M35',75),(32,'2','M',78),(32,'3','0',79),(32,'0','5',80),(33,'1','M',81),(33,'5','0',82),(33,'5','5',83),(34,'1212','M05',84),(34,'12121','M20',85),(36,'1','M',89),(36,'0','0',90),(36,'0','5',91),(37,'1','M',92),(37,'2','0',93),(37,'3','5',94),(38,'20','M05',95),(38,'30','M25',96),(39,'2','M',97),(39,'9','0',98),(39,'8','5',99),(40,'20','M05',100),(40,'30','M25',101),(41,'5','M',102),(41,'6','0',103),(41,'8','5',104),(42,'254','M05',105),(43,'1212','M05',106),(44,'1000','M100',107),(45,'988','M25',108),(45,'5434','M05',109),(46,'20','M7.5',110),(46,'30','M05',111),(47,'2423','M05',112),(48,'23','M05',113);

/*Table structure for table `ordermultiple` */

DROP TABLE IF EXISTS `ordermultiple`;

CREATE TABLE `ordermultiple` (
  `orderId` int(11) default NULL,
  `quantity` varchar(255) default NULL,
  `quality` varchar(255) default NULL,
  KEY `orderId` (`orderId`),
  CONSTRAINT `ordermultiple_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `ordermultiple` */

insert  into `ordermultiple`(`orderId`,`quantity`,`quality`) values (64,'100','M05'),(64,'100','M30'),(64,'100','M45'),(64,'100','M65'),(64,'100','M80'),(65,'1000','M05'),(65,'2000','M30'),(65,'3000','M45'),(65,'4000','M65'),(65,'5000','M80'),(66,'34','M05'),(66,'0','M30'),(66,'0','M45'),(66,'67','M65'),(66,'0','M80'),(67,'22','M05'),(67,'56','M30'),(67,'33','M45'),(67,'12','M65'),(67,'79','M80'),(68,'50','M05'),(68,'100','M25'),(68,'150','M7.5'),(68,'105','M35'),(69,'25','M05'),(69,'36','M25'),(69,'13','M7.5'),(69,'12','M35'),(71,'1','M05'),(72,'2','M05');

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL auto_increment,
  `generationDate` varchar(255) default NULL,
  `requiredByDate` varchar(255) default NULL,
  `requestedBy` varchar(255) default NULL,
  `requestedById` int(11) default NULL,
  `supplierId` int(11) default NULL,
  `companyName` varchar(255) default NULL,
  `customerSite` varchar(255) default NULL,
  `POId` int(11) default NULL,
  `status` varchar(255) default NULL,
  `statusDate` varchar(255) default NULL,
  `statusDesc` varchar(255) default NULL,
  PRIMARY KEY  (`orderId`),
  KEY `POId` (`POId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`POId`) REFERENCES `purchaseorder` (`POId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `orders` */

insert  into `orders`(`orderId`,`generationDate`,`requiredByDate`,`requestedBy`,`requestedById`,`supplierId`,`companyName`,`customerSite`,`POId`,`status`,`statusDate`,`statusDesc`) values (64,'1532020281509','1532063422898','abhinav',5,1,'aj','vijay nagar',25,'submitted','1532020281509','Your orders is submitted and is waiting to get confirmation from seller'),(65,'1532020348357','1532063490816','abhinav',5,1,'aj','vijay nagar',25,'submitted','1532020348357','Your orders is submitted and is waiting to get confirmation from seller'),(66,'1532020471429','1532135632948','abhinav',5,6,'aj','vijay nagar',25,'submitted','1532020471429','Your orders is submitted and is waiting to get confirmation from seller'),(67,'1532022850783','1532030029167','abhinav',5,1,'aj','vijay nagar',25,'cancelled','1532022906498','undefined'),(68,'1532028362720','1532114600945','abhinav',5,3,'aj','MR9 indore',27,'submitted','1532028362720','Your orders is submitted and is waiting to get confirmation from seller'),(69,'1532029747202','1532548124081','abhinav',5,1,'aj','MR9 indore',26,'submitted','1532029747202','Your orders is submitted and is waiting to get confirmation from seller'),(70,'1532030654004','1532297045265','Muskan',18,2,'undefined','annapurna',29,'submitted','1532030654004','Your orders is submitted and is waiting to get confirmation from seller'),(71,'1532036160798','1532734558255','abhinav',5,6,'aj','vijay nagar',31,'submitted','1532036160798','Your orders is submitted and is waiting to get confirmation from seller'),(72,'1532036208957','1532561782758','abhinav',5,4,'aj','vijay nagar',31,'submitted','1532036208957','Your orders is submitted and is waiting to get confirmation from seller');

/*Table structure for table `pomultiple` */

DROP TABLE IF EXISTS `pomultiple`;

CREATE TABLE `pomultiple` (
  `Quantity` varchar(255) default NULL,
  `Quality` varchar(255) default NULL,
  `price` varchar(255) default NULL,
  `POId` int(11) default NULL,
  `remQuantity` varchar(255) default NULL,
  KEY `POId` (`POId`),
  CONSTRAINT `pomultiple_ibfk_1` FOREIGN KEY (`POId`) REFERENCES `purchaseorder` (`POId`),
  CONSTRAINT `pomultiple_ibfk_2` FOREIGN KEY (`POId`) REFERENCES `purchaseorder` (`POId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `pomultiple` */

insert  into `pomultiple`(`Quantity`,`Quality`,`price`,`POId`,`remQuantity`) values ('1234','M05','1000',25,'78'),('2345','M30','1000',25,'189'),('3456','M45','1000',25,'323'),('4567','M65','1000',25,'388'),('5678','M80','1000',25,'499'),('100','M05','2345',26,'75'),('200','M25','6567',26,'164'),('300','M7.5','8765',26,'287'),('210','M35','9876',26,'198'),('100','M05','6576',27,'50'),('200','M25','8987',27,'100'),('300','M7.5','8765',27,'150'),('210','M35','5463',27,'105'),('1200','M05','5656',28,'1200'),('4000','M20','7655',28,'4000'),('2423','M05','50000',30,'2423'),('23','M05','2324',31,'0');

/*Table structure for table `pricetable` */

DROP TABLE IF EXISTS `pricetable`;

CREATE TABLE `pricetable` (
  `price` varchar(255) default NULL,
  `id` int(11) default NULL,
  `quoteId` int(11) default NULL,
  `priceId` int(11) NOT NULL auto_increment,
  PRIMARY KEY  (`priceId`),
  KEY `id` (`id`),
  CONSTRAINT `pricetable_ibfk_1` FOREIGN KEY (`id`) REFERENCES `responses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `pricetable` */

insert  into `pricetable`(`price`,`id`,`quoteId`,`priceId`) values ('20000',11,28,1),('40000',11,28,2),('6000',11,28,3),('1000',12,29,4),('2000',12,29,5),('3000',12,29,6),('4000',12,29,7),('5000',12,29,8),('2345',13,30,9),('6567',13,30,10),('8765',13,30,11),('9876',13,30,12),('2656',15,29,15),('3454',15,29,16),('4565',15,29,17),('6575',15,29,18),('8767',15,29,19),('6576',16,30,20),('8987',16,30,21),('8765',16,30,22),('5463',16,30,23),('10',17,32,25),('20',17,32,26),('30',17,32,27),('10',19,34,31),('20',19,34,32),(NULL,21,36,36),(NULL,21,36,37),(NULL,21,36,38),(NULL,22,37,39),(NULL,22,37,40),(NULL,22,37,41),(NULL,23,38,42),(NULL,23,38,43),(NULL,24,39,44),(NULL,24,39,45),(NULL,24,39,46),(NULL,25,40,47),(NULL,25,40,48),(NULL,26,41,49),(NULL,26,41,50),(NULL,26,41,51),('5060',27,42,52),(NULL,28,43,53),('908079',29,44,54),(NULL,30,45,55),(NULL,30,45,56),('100',31,46,57),('200',31,46,58),('50000',32,47,59),('2324',33,48,60),('100',34,47,61),('5678',39,43,66),('1000',40,30,67),('2000',40,30,68),('3000',40,30,69),('4000',40,30,70),('2020',42,48,74),(NULL,47,33,84),(NULL,47,33,85),(NULL,47,33,86);

/*Table structure for table `purchaseorder` */

DROP TABLE IF EXISTS `purchaseorder`;

CREATE TABLE `purchaseorder` (
  `generationDate` varchar(255) default NULL,
  `validTill` varchar(255) default NULL,
  `customerSite` varchar(255) default NULL,
  `requestedBy` varchar(255) default NULL,
  `requestedById` int(11) default NULL,
  `supplierId` int(11) default NULL,
  `requestedByCompany` varchar(255) default NULL,
  `confirmedBySupplier` enum('true','false') default NULL,
  `POId` int(11) NOT NULL auto_increment,
  `deletedByContractor` enum('true','false') default 'false',
  PRIMARY KEY  (`POId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `purchaseorder` */

insert  into `purchaseorder`(`generationDate`,`validTill`,`customerSite`,`requestedBy`,`requestedById`,`supplierId`,`requestedByCompany`,`confirmedBySupplier`,`POId`,`deletedByContractor`) values ('1532020155974','154567890987','vijay nagar','abhinav',5,6,'aj','true',25,'false'),('1532026050827','154656778887','MR9 indore','abhinav',5,6,'aj','true',26,'false'),('1532028131270','154678987778','MR9 indore','abhinav',5,3,'aj','true',27,'false'),('1532028554400','156785656566','MR9 indore','abhinav',5,3,'aj','true',28,'false'),('1532030233779','154667776655','annapurna','Muskan',18,2,'undefined','true',29,'false'),('1532035425253','15467876654','vijay nagar','abhinav',5,3,'aj','true',30,'false'),('1532035816402','15467895858','vijay nagar','abhinav',5,4,'aj','true',31,'false');

/*Table structure for table `quotes` */

DROP TABLE IF EXISTS `quotes`;

CREATE TABLE `quotes` (
  `customerSite` varchar(255) default NULL,
  `generationDate` varchar(255) default NULL,
  `requiredDate` varchar(255) default NULL,
  `requestedBy` varchar(255) default NULL,
  `requestedByCompany` varchar(255) default NULL,
  `requestedById` int(11) default NULL,
  `quoteId` int(11) NOT NULL auto_increment,
  PRIMARY KEY  (`quoteId`),
  KEY `FK_quotes` (`requestedById`),
  CONSTRAINT `FK_quotes` FOREIGN KEY (`requestedById`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `quotes` */

insert  into `quotes`(`customerSite`,`generationDate`,`requiredDate`,`requestedBy`,`requestedByCompany`,`requestedById`,`quoteId`) values ('palasia','1532013635410','1890256378909','abhinav','aj',5,28),('vijay nagar','1532019213189','1532105483683','abhinav','aj',5,29),('MR9 indore','1532022955421','1532800524426','abhinav','aj',5,30),('MR9 indore','1532029706588','1532116101665','abhinav','aj',5,32),('annapurna','1532029900739','1532202669676','Muskan','ultratech',18,33),('test Address','1532030692384','1532117072532','Tester','ultratech',19,34),('test Address','1532031168860','1532117556670','Tester','ultratech',19,36),('vijay nagar','1532031832802','1532118231132','abhinav','aj',5,37),('vijay nagar','1532031891241','1532118283099','abhinav','aj',5,38),('vijay nagar','1532032425503','1532118830136','abhinav','aj',5,39),('vijay nagar','1532032479848','1532723681381','abhinav','aj',5,40),('vijay nagar','1532032595423','1532637396244','abhinav','aj',5,41),('vijay nagar','1532033050812','1532378656202','abhinav','aj',5,42),('vijay nagar','1532033150131','1532119543504','abhinav','aj',5,43),('vijay nagar','1532033295480','1532378892798','abhinav','aj',5,44),('vijay nagar','1532033495344','1532379081570','abhinav','aj',5,45),('vijay nagar','1532033591163','1532119489155','abhinav','aj',5,46),('vijay nagar','1532035287431','1532553689459','abhinav','aj',5,47),('vijay nagar','1532035690727','1532122096808','abhinav','aj',5,48);

/*Table structure for table `responses` */

DROP TABLE IF EXISTS `responses`;

CREATE TABLE `responses` (
  `rmxId` int(11) default NULL,
  `validTill` varchar(255) default NULL,
  `quoteId` int(11) default NULL,
  `userId` int(11) default NULL,
  `id` int(11) NOT NULL auto_increment,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `responses` */

insert  into `responses`(`rmxId`,`validTill`,`quoteId`,`userId`,`id`) values (6,'154678908772',28,5,11),(1,'154567890987',29,5,12),(1,'154656778887',30,5,13),(6,'156787878787',29,5,15),(3,'154678987778',30,5,16),(6,'156767767767',32,5,17),(6,'156767678778',34,19,19),(NULL,NULL,36,19,21),(NULL,NULL,37,5,22),(NULL,NULL,38,5,23),(NULL,NULL,39,5,24),(NULL,NULL,40,5,25),(NULL,NULL,41,5,26),(6,'3809808000000',42,5,27),(1,'154345675566',43,5,28),(6,'4062009600000',44,5,29),(NULL,NULL,45,5,30),(6,'1553299200000',46,5,31),(3,'15467876654',47,5,32),(4,'15467895858',48,5,33),(6,'0',47,5,34),(6,'1567900800000',43,5,39),(6,'1519084800000',30,5,40),(6,'1550880000000',48,5,42),(NULL,NULL,33,18,47);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` int(11) NOT NULL auto_increment,
  `name` varchar(255) default NULL,
  `email` varchar(255) default NULL,
  `custType` varchar(255) default NULL,
  `contact` bigint(10) default NULL,
  `pan` varchar(255) default NULL,
  `company` varchar(255) default NULL,
  `gstin` varchar(255) default NULL,
  `password` varchar(255) default NULL,
  `usertype` varchar(255) default NULL,
  `resetPasswordExpire` varchar(255) default NULL,
  `resetPasswordToken` varchar(255) default NULL,
  `verified` enum('true','false') default 'false',
  PRIMARY KEY  (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `user` */

insert  into `user`(`userId`,`name`,`email`,`custType`,`contact`,`pan`,`company`,`gstin`,`password`,`usertype`,`resetPasswordExpire`,`resetPasswordToken`,`verified`) values (1,'abh','abahaha',NULL,NULL,NULL,NULL,NULL,NULL,'supplier','1530273728759','88be5fab6db3baf60412965c4f833efd88d26a06','false'),(2,'Tester','tester22@gmail.com','Buyer',987654321,'APEGASJJS','TEST company','jedwd','1234','contractor','1530273728759','88be5fab6db3baf60412965c4f833efd88d26a06','false'),(3,'Tester','tester22@gmail.com','Buyer',987654321,'APEGASJJS','TEST company','jedwd','$2a$10$4Hl/QCm37bkj8R2MnahwzOckCkOvFFdi9jns24fY2tDhZG.2e76FK','contractor','1530273728759','88be5fab6db3baf60412965c4f833efd88d26a06','false'),(4,'abhi','test@gmail.com','buyer',2147483647,'abaha21313','undefined','asadb1221313','$2a$10$nJLXCiq2znY8DNz7ytK/Xek1IUyJ8fXDN9AkUCzvkjksViEk.aw6S','contractor','1530273728759','88be5fab6db3baf60412965c4f833efd88d26a06','false'),(5,'abhinav','abhinav23jain@gmail.com','buyer',2147483647,'aghs1234789','aj','agshsg1234','$2a$10$.ceKtDXB4sz/0xgvLGkLMepwutWwLXOONEenIulmoLWOLFxvKx4c2','contractor','1530391221409','a011436e295c0d6e5b6f0a8f48f15a5af9294370','true'),(6,'Abhinav Jain','abhinav23245jain@gmail.com',NULL,8787878787,'asasasdad',NULL,'dasdsadsad','$2a$10$quuAyiHDVxGnTj0wqWZlke23oE46.U2ieoMi2BfHjzpbHoEZ1Eani','supplier',NULL,NULL,'false'),(7,'abhi','abhinav2324jain@gmail.com',NULL,2147483647,NULL,NULL,NULL,'$2a$10$htQFakUX3q4rufN.1gjOo.j4COwgRwUCQ4KDsQXnFURPliOuRKuPW','supplier',NULL,NULL,'false'),(8,'abhinav jain','abhinav2324jain@gmail.com',NULL,2147483647,NULL,NULL,NULL,'$2a$10$MK1IfGIpdwpaNjQ3wzQlhu8iDu5BYDvuo55WPh0DA8RyaBG2pEb2.','supplier',NULL,NULL,'false'),(9,'Test','test22@gmail.com','Individual',1234567890,'null','undefined','null','$2a$10$K8QZ4lqkqTFM6m17qB/68u9pMLN.sp53.oOnfVozpsHS76He/GyDe','contractor',NULL,NULL,'false'),(10,'Test44','test223@gmail.com','Individual',1234567890,'null','undefined','null','$2a$10$IsQQJNKI9Wy9FQZMLmaco.VjwlpYQo6O0gXgCvcwn.YGKAcswFG9C','contractor',NULL,NULL,'false'),(11,'Test56','test00@gmail.com','Buyer',1234567890,'ASFFHJK','Abcd','null','$2a$10$Lp4UnJ5cjVPS5zH1Bng1/u/IoZK9tchiCliIY6sYNVPIigQoldxmG','contractor',NULL,NULL,'false'),(12,'Test','test08@gmail.com','Individual',1234567890,'null','undefined','null','$2a$10$izvePbx6eMXpwhaI4SkRWePjiZKGIsI9jmqcbn.6mJAMW2Ja1W1b2','contractor',NULL,NULL,'false'),(13,'Test','test88@gmail.com','Individual',9876543210,'null','undefined','null','$2a$10$uCHPyeii4.juszpOauGczemVuMoAvvUiRwXPXqYbHrPC7SBdYalrO','contractor',NULL,NULL,'false'),(14,'Abcd','qwerty@gmail.com','Individual',9876543210,'null','undefined','null','$2a$10$nuLg3yh0ifehZeuYY/4gH.RGQWbwWuCZCj4nqCXuunln8P/ExY4He','contractor',NULL,NULL,'false'),(15,'Test','test0@gmail.com','Individual',9876543210,'123444hhg','undefined','null','$2a$10$u90JnPVmlNMzmYYzBToQWuO0l7izhUz381WTNr9dvZuURePNQoue2','contractor',NULL,NULL,'false'),(16,'Akash','abs@abd.in','Individual',9669911111,'null','undefined','null','$2a$10$ZoeclmSakvYPb3W.TUSW0erw4CvX/UXa175MTB/zcMhU6T76SvYV.','contractor',NULL,NULL,'false'),(17,'Name','test001@gmail.com','Individual',9876543210,'null','undefined','null','$2a$10$4JojM2MC6sRDHAMxU8JTT.C6U7El3aVgwDbc7DlRXUXywUhTq3n5.','contractor',NULL,NULL,'false'),(18,'Muskan','Muskankataria2408@gmail.com','Individual',9039816856,'null','undefined','null','$2a$10$gzNffoAGTK//UZN3S0iIsumFdOOQye7mA1SvalFriFeJePHLvC8Uy','contractor',NULL,NULL,'false'),(19,'Tester','tester_test@gmail.com','Individual',9876543210,'null','undefined','null','$2a$10$f5Wrl0n3xgWPIEpQHjQOeOjlIActOsjDRYhOEDA5AWzI/jwV36QyS','contractor',NULL,NULL,'false');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
