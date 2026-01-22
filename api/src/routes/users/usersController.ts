
import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { usersTable } from '../../db/usersSchema.js';
import { eq } from 'drizzle-orm';

export async function getUserProfile(req: Request, res: Response) {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, Number(userId)));

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // @ts-ignore
        delete user.password;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
}

export async function updateUserProfile(req: Request, res: Response) {
    try {
        const userId = req.userId;
        const { name, lga, dateOfBirth, address, city, country, image } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const [updatedUser] = await db
            .update(usersTable)
            .set({
                name,
                lga,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                address,
                city,
                country,
                image,
                updatedAt: new Date(),
            })
            .where(eq(usersTable.id, Number(userId)))
            .returning();

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // @ts-ignore
        delete updatedUser.password;
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
}
