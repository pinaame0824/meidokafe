from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import os

# --- Database Setup ---
DATABASE_URL = "sqlite:///./alice_cafe.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Models ---
class InquiryDB(Base):
    __tablename__ = "inquiries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String)
    phone = Column(String, nullable=True)
    subject = Column(String)
    message = Column(Text)
    created_at = Column(String)

class ApplicationDB(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    email = Column(String)
    phone = Column(String)
    experience = Column(String)
    message = Column(Text)
    created_at = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas (for API validation) ---
class InquiryCreate(BaseModel):
    name: str
    email: str
    phone: str = None
    subject: str
    message: str

class ApplicationCreate(BaseModel):
    name: str
    age: int
    email: str
    phone: str
    experience: str
    message: str

# --- FastAPI App ---
app = FastAPI()

# Allow CORS (Frontend requests from localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Magical Cafe ALICE Backend is running!"}

# Submit Inquiry
@app.post("/api/inquiries")
def create_inquiry(inquiry: InquiryCreate, db: Session = Depends(get_db)):
    db_item = InquiryDB(
        name=inquiry.name,
        email=inquiry.email,
        phone=inquiry.phone,
        subject=inquiry.subject,
        message=inquiry.message,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_item)
    db.commit()
    return {"message": "Success"}

# Submit Application
@app.post("/api/applications")
def create_application(app_data: ApplicationCreate, db: Session = Depends(get_db)):
    db_item = ApplicationDB(
        name=app_data.name,
        age=app_data.age,
        email=app_data.email,
        phone=app_data.phone,
        experience=app_data.experience,
        message=app_data.message,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(db_item)
    db.commit()
    return {"message": "Success"}

# Get All Data (For Admin)
@app.get("/api/admin/data")
def get_admin_data(password: str, db: Session = Depends(get_db)):
    if password != "demo": # Simple password check
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    inquiries = db.query(InquiryDB).order_by(InquiryDB.id.desc()).all()
    applications = db.query(ApplicationDB).order_by(ApplicationDB.id.desc()).all()
    
    return {
        "inquiries": inquiries,
        "applications": applications
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
