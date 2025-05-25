from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

class Flight(Base):
    __tablename__ = "flights"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    drone_id = Column(String, unique=False, nullable=False)

class Pilot(Base):
    __tablename__ = "pilots"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    drones = relationship("Drone", back_populates="pilot", cascade="all, delete-orphan")

class Drone(Base):
    __tablename__ = "drones"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    drone_id = Column(String, unique=True, nullable=False)  # ID дрона, который ты передаёшь
    pilot_id = Column(UUID(as_uuid=True), ForeignKey("pilots.id"), nullable=False)
    pilot = relationship("Pilot", back_populates="drones")
