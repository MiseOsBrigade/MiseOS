import { logger } from './logger';

/**
 * Mirrors Kitchen Comms chat messages into Slack via the Slack Web API,
 * using the Replit Slack connector for credentials. Designed to degrade
 * gracefully: if the connector is not yet authorized, posting is skipped
 * (returns false) and the message is still stored encrypted.
 */

const DEPT_EMOJI: Record<string, string> = {
  pipeline: ':factory:',
  platform: ':gear:',
  reliability: ':rotating_light:',
  security: ':lock:',
  data: ':bar_chart:',
};

interface SlackPayload {
  agent: string;
  department: string;
  role: string;
  text: string;
  messageType: 'normal' | 'alert' | 'system';
}

let cachedChannelId: string | null = null;

function getReplitToken(): string | null {
  if (process.env.REPL_IDENTITY) {
    return 'repl ' + process.env.REPL_IDENTITY;
  }
  if (process.env.WEB_REPL_RENEWAL) {
    return 'depl ' + process.env.WEB_REPL_RENEWAL;
  }
  return null;
}

async function getAccessToken(): Promise<string | null> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = getReplitToken();
  if (!hostname || !xReplitToken) return null;

  try {
    const res = await fetch(
      `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=slack`,
      {
        headers: {
          Accept: 'application/json',
          X_REPLIT_TOKEN: xReplitToken,
        },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      items?: Array<{ settings?: { access_token?: string; bot_token?: string } }>;
    };
    const settings = data.items?.[0]?.settings;
    return settings?.access_token ?? settings?.bot_token ?? null;
  } catch (err) {
    logger.debug({ err }, 'Slack token fetch failed');
    return null;
  }
}

async function slackApi(
  token: string,
  method: string,
  body: Record<string, unknown>,
): Promise<any> {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function resolveChannelId(token: string): Promise<string | null> {
  if (cachedChannelId) return cachedChannelId;

  // Explicit override wins.
  if (process.env.SLACK_CHANNEL_ID) {
    cachedChannelId = process.env.SLACK_CHANNEL_ID;
    return cachedChannelId;
  }

  // Otherwise, only ever post to a channel the bot has been explicitly
  // invited to (is_member). This prevents leaking messages to an arbitrary
  // channel; posting to a non-member channel would fail anyway.
  try {
    const data = await slackApi(token, 'conversations.list', {
      types: 'public_channel',
      exclude_archived: true,
      limit: 200,
    });
    if (!data.ok || !Array.isArray(data.channels)) return null;
    const channels = data.channels as Array<{
      id: string;
      name: string;
      is_member: boolean;
    }>;
    const member = channels.filter((c) => c.is_member);
    if (member.length === 0) {
      logger.warn(
        'Slack connected but bot is not a member of any channel — set SLACK_CHANNEL_ID or invite the bot to a channel',
      );
      return null;
    }
    const preferred =
      member.find((c) => /kitchen|comms|orchestra|general/.test(c.name)) ??
      member[0];
    cachedChannelId = preferred?.id ?? null;
    return cachedChannelId;
  } catch (err) {
    logger.debug({ err }, 'Slack channel resolution failed');
    return null;
  }
}

export async function postChatToSlack(payload: SlackPayload): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  const channel = await resolveChannelId(token);
  if (!channel) return false;

  const emoji = DEPT_EMOJI[payload.department] ?? ':speech_balloon:';
  const prefix = payload.messageType === 'alert' ? ':warning: ' : '';

  const result = await slackApi(token, 'chat.postMessage', {
    channel,
    text: `${prefix}${emoji} *${payload.agent}* _(${payload.role})_\n${payload.text}`,
    unfurl_links: false,
  });

  if (!result.ok) {
    logger.warn({ error: result.error }, 'Slack chat.postMessage failed');
    return false;
  }
  return true;
}
