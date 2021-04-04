CREATE TABLE CLINIC(
	ClinicID		INT,
    Address 		VARCHAR(30) NOT NULL,
    NumPatients 	INT,
    NumDoctors 		INT,
    PhoneNumber 	INT NOT NULL,
    PRIMARY	KEY(ClinicID)
);

CREATE TABLE DOCTOR(
	Fname			VARCHAR(15)	NOT NULL,
    Minit			CHAR,
    Lname			VARCHAR(15)	NOT NULL,
    Address 		VARCHAR(30),
    DoctorID 		INT,
    PhoneNumber 	INT	NOT NULL,
    DOB				DATE,
    ClinicID	INT,
    PRIMARY KEY (DoctorID),
    FOREIGN KEY (ClinicID) REFERENCES CLINIC(ClinicID)
);

CREATE TABLE PATIENT(
	PatientID 		INT AUTO_INCREMENT,
	Fname			VARCHAR(15) NOT NULL,
    Minit			VARCHAR(5),
    Lname			VARCHAR(15) NOT NULL,
    Address 		VARCHAR(100) NOT NULL,
    Email 			VARCHAR(30),
    SSN				CHAR(9),
    PhoneNumber 	VARCHAR(15) NOT NULL,
    Relation		VARCHAR(30),
    DOB				DATE NOT NULL,
    PrimePhysID		INT,
    Pass 		VARCHAR(30),
    UNIQUE (SSN),
    PRIMARY KEY (PatientID),
    FOREIGN KEY (PrimePhysID) REFERENCES DOCTOR	(DoctorID)
);


CREATE TABLE EMERGENCY_CONTACT(
	ContactID       INT,
	Fname			VARCHAR(15) NOT NULL,
    Minit			CHAR,
    Lname			VARCHAR(15) NOT NULL,
	DOB				DATE,
    Address 		VARCHAR(30),
    PhoneNumber 	VARCHAR(14) NOT NULL,
    Relationship	VARCHAR(30),
    PRIMARY KEY (ContactID),
    FOREIGN KEY (ContactID) REFERENCES DOCTOR(DoctorID),
    FOREIGN KEY (ContactID) REFERENCES PATIENT(PatientID)
);


CREATE TABLE MEDICAL_CHART(
	PatientID		INT,
	Sex				VARCHAR(10) NOT NULL,
    BloodType		VARCHAR(10),
    Height			VARCHAR(15),
    Weight 			DOUBLE,
    FamilyHist		VARCHAR(50),
    SurgicalHist	VARCHAR(50),
    Allergies		VARCHAR(50),
    PRIMARY KEY (PatientID),
    FOREIGN KEY (PatientID) REFERENCES PATIENT (PatientID)
);

CREATE TABLE APPOINTMENT(
	AppointID		INT,
	AppointTime		DATETIME    NOT NULL,
    DoctorID		INT NOT NULL,
    PatientID       INT NOT NULL,
    LocationID		INT	NOT NULL,
    InsuranceProv	VARCHAR(15),
    PhysicianAppr	VARCHAR(15),
    Reason			VARCHAR(30),
    UNIQUE (PatientID),
    PRIMARY KEY (AppointID),
    FOREIGN KEY (LocationID) REFERENCES CLINIC (ClinicID),
    FOREIGN KEY (PatientID) REFERENCES PATIENT (PatientID),
    FOREIGN KEY (DoctorID) REFERENCES DOCTOR (DoctorID)
);

CREATE TABLE APPOINTMENT_REPORT(
	AppointID		INT,
    Diagnosis		VARCHAR(100),
    Summary			VARCHAR(100),
    PRIMARY KEY (AppointID),
    FOREIGN KEY (AppointID) REFERENCES APPOINTMENT (AppointID)
);

CREATE TABLE INSURANCE(
    PolicyID        INT,
	Provider		VARCHAR(15)				NOT NULL,
    ExpiDate		DATE					NOT NULL,
    InsurancePolicy	VARCHAR(50)				NOT NULL,
    PatientID       INT NOT NULL,
    PRIMARY KEY (PolicyID),
    FOREIGN KEY (PatientID) REFERENCES PATIENT(PatientID)
);

CREATE TABLE StaffRole(
    RoleName VARCHAR(30),
    RoleNo INT,
    RoleDescription VARCHAR(200),
    PRIMARY KEY (RoleNo)
);

CREATE TABLE STAFF(
    StaffID        INT,
	StaffRoleNo		INT,
	Fname			VARCHAR(15)				NOT NULL,
    Minit			CHAR,
    Lname			VARCHAR(15)				NOT NULL,
    Address 		VARCHAR(30),
    PhoneNumber 	INT						NOT NULL,
    DOB				DATE,
    PRIMARY KEY (StaffID),
	FOREIGN KEY (StaffRoleNo) REFERENCES StaffRole(RoleNo)
);