"""
Prisma client singleton — connect / disconnect via FastAPI lifespan.
"""

from prisma import Prisma

db = Prisma()
