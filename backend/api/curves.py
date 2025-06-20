from sqlalchemy.orm import Session
from . import models

def get_all_curves(db: Session):
    return db.query(models.CurveModel).all()


def get_curve_by_zone(db: Session, zone_id: int):
    return db.query(models.CurveModel).filter(models.CurveModel.zone == zone_id).first()

def delete_curve(db: Session, zone_id: int):
    db_curve = get_curve_by_zone(db, zone_id)
    if db_curve:
        db.delete(db_curve)
        db.commit()
        return True
    return False

