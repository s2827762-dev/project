from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_health_points():
    return {
        "total_points": 1250,
        "this_week": 180,
        "this_month": 720,
        "leaderboard": [
            {"rank": 1, "name": "Rajesh Kumar", "points": 2150},
            {"rank": 2, "name": "Priya Sharma", "points": 1890},
            {"rank": 3, "name": "You", "points": 1250},
            {"rank": 4, "name": "Amit Patel", "points": 1100},
            {"rank": 5, "name": "Sunita Devi", "points": 950}
        ]
    }

@router.get("/achievements")
def get_achievements():
    return [
        {
            "id": 1,
            "title": "Medicine Master",
            "description": "Take medicines on time for 7 days straight",
            "points": 100,
            "completed": True
        },
        {
            "id": 2,
            "title": "Health Tracker",
            "description": "Log symptoms for 5 consecutive days",
            "points": 75,
            "completed": False,
            "progress": 60
        }
    ]