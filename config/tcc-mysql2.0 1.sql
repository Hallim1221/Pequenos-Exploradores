create database TCC;
use TCC; 
/*Criando a tabelas*/
 
create table  Plano
(
Idplano int not null,
Modelo  varchar (50) not null, 
Moedinhas  int not null, 
constraint pkidplano primary key (Idplano) 
);
 
create table Recompensas 
( 
Idrecompensas int not null,
Nome varchar (100) not null,
Tipo varchar (50) not null, 
Valor_Moedinhas int not null,
constraint pkidrecompensas primary key (Idrecompensas) 
);
 
create table Instituicao 
( 
Idinstituicao int not null, 
Instituicao_Ensino char(1) not null,
Endereco varchar (200) not null,
Telefone varchar (20) not null, 
Modelo_de_plano char (2) not null,
Nome varchar (100) not null, 
constraint pkidinstituicao primary key (Idinstituicao)
);
 
 
create table Professor 
(
Idprofessor int not null,
Email varchar (100) not null, 
Idinstituicao int not null, 
Nome varchar (1000) not null,
constraint pkidprofessor primary key (Idprofessor),
constraint fkidinstituicao  foreign key (Idinstituicao) references Instituicao (Idinstituicao) 
);
 
create table Adm 
(
Idadm int not null, 
Idinstituicao int not null, 
constraint pkidam primary key (Idadm),
constraint fkadmidinstituicao  foreign key (Idinstituicao) references Instituicao (Idinstituicao) 
);

create  table Aluno
( 
Idaluno int not null, 
Nome varchar (1000) not null,
Avatar varchar(100) not null,
Moedinhas int not null, 
Data_nascimento date not null,
Idinstituicao int not null, 
constraint pkidaluno primary key (Idaluno),
constraint fkalunoidinstituicao  foreign key (Idinstituicao) references Instituicao (Idinstituicao) 
);
 
create table Serie 
(
Idserie int not null, 
Turma varchar (26) not null,
Idaluno int not null, 
Idprofessor int not null,
constraint pkidserie  primary key (Idserie),
constraint fkidaluno  foreign key (Idaluno) references Aluno (Idaluno),
constraint fkidprofessor foreign  key (Idprofessor) references Professor (Idprofessor) 
);
 
 create table Atividade
( 
Idatividade int not null, 
Nivel int not null, 
Formato varchar (50) not null, 
Pontuacao int not null, 
Idserie int not null, 
Idaluno int not null, 
Idprofessor int not null,
constraint  pkidatividade primary key  (Idatividade),
constraint fkatividadeIdserie foreign key (Idserie) references Serie (Idserie),
constraint fkatividadeIdaluno foreign key (Idaluno) references Aluno (Idaluno),
constraint fkatividadeIdprofessor foreign key (Idprofessor) references Professor (Idprofessor) 
); 