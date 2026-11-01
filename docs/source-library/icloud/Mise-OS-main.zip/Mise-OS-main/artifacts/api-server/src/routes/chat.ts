import { Router } from 'express';
import { db } from '@workspace/db';
import { chatMessagesTable } from '@workspace/db';
import { desc, eq } from 'drizzle-orm';
import {
  ListChatMessagesQueryParams,
  CreateChatMessageBody,
} from '@workspace/api-zod';
import { encrypt, decrypt } from '../lib/crypto';
import { postChatToSlack } from '../lib/slack';
import { logger } from '../lib/logger';

const router = Router();

// GET /api/chat/messages — returns decrypted messages, oldest first
router.get('/chat/messages', async (req, res) => {
  try {
    const { limit } = ListChatMessagesQueryParams.parse(req.query);

    const rows = await db
      .select()
      .from(chatMessagesTable)
      .orderBy(desc(chatMessagesTable.createdAt))
      .limit(limit ?? 60);

    const messages = rows
      .reverse()
      .map((row) => ({
        id: row.id,
        agent: row.agent,
        department: row.department,
        role: row.role,
        messageType: row.messageType as 'normal' | 'alert' | 'system',
        text: decrypt({
          ciphertext: row.ciphertext,
          iv: row.iv,
          authTag: row.authTag,
        }),
        postedToSlack: row.postedToSlack,
        createdAt: row.createdAt.toISOString(),
      }));

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/chat/messages — encrypts at rest + mirrors to Slack
router.post('/chat/messages', async (req, res) => {
  try {
    const body = CreateChatMessageBody.parse(req.body);

    const enc = encrypt(body.text);

    // Persist (encrypted) first so a Slack failure can never produce a
    // Slack-only message that isn't recorded at rest.
    const [row] = await db
      .insert(chatMessagesTable)
      .values({
        agent: body.agent,
        department: body.department,
        role: body.role,
        messageType: body.messageType,
        ciphertext: enc.ciphertext,
        iv: enc.iv,
        authTag: enc.authTag,
        postedToSlack: false,
      })
      .returning();

    if (!row) {
      res.status(500).json({ error: 'Failed to store message' });
      return;
    }

    // Then mirror to Slack and record delivery status (best-effort).
    let postedToSlack = false;
    try {
      postedToSlack = await postChatToSlack({
        agent: body.agent,
        department: body.department,
        role: body.role,
        text: body.text,
        messageType: body.messageType,
      });
      if (postedToSlack) {
        await db
          .update(chatMessagesTable)
          .set({ postedToSlack: true })
          .where(eq(chatMessagesTable.id, row.id));
      }
    } catch (slackErr) {
      logger.warn({ err: slackErr }, 'Slack mirror failed (message still stored)');
    }

    res.status(201).json({
      id: row.id,
      agent: row.agent,
      department: row.department,
      role: row.role,
      messageType: row.messageType as 'normal' | 'alert' | 'system',
      text: body.text,
      postedToSlack,
      createdAt: row.createdAt.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
