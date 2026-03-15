import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  auditInteractionSummaryFromTranscript,
  auditInteractionSummaryFromTranscriptMessages,
  buildInteractionSummaryFromTranscript,
  buildInteractionSummaryFromTranscriptMessages,
  extractVisibleConversationText,
  loadSoulBondTranscriptMessages,
} from "./transcript.js";

const tempDirs: string[] = [];

async function createTempTranscript(lines: string[]) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "soulbond-transcript-"));
  tempDirs.push(dir);
  const transcriptPath = path.join(dir, "session.jsonl");
  await fs.writeFile(transcriptPath, lines.join("\n"));
  return transcriptPath;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0, tempDirs.length).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe("soulbond transcript extraction", () => {
  it("strips inbound metadata wrappers and reply tags", () => {
    const wrapped = `Conversation info (untrusted metadata):\n\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\`\`\`json\n{}\n\`\`\`\n\nSender (untrusted metadata):\n\`\`\`json\n{}\n\`\`\`\n\n[[reply_to_current]] 我打算今天继续推进 SoulClaw`;
    expect(extractVisibleConversationText(wrapped)).toBe("我打算今天继续推进 SoulClaw");
  });

  it("strips sender metadata blocks even without a conversation-info prefix", () => {
    const wrapped = `Sender (untrusted metadata):
\`\`\`json
{}
\`\`\`

[Sun 2026-03-08 15:05 GMT+8] 啊你居然知道了！`;
    expect(extractVisibleConversationText(wrapped)).toBe("啊你居然知道了！");
  });

  it("strips queued-message wrappers before visible text", () => {
    expect(
      extractVisibleConversationText(
        "[Queued messages while agent was busy] --- Queued #1 [Sun 2026-03-08 12:20 GMT+8] 我已经救活了，没事没事，不用查了",
      ),
    ).toBe("我已经救活了，没事没事，不用查了");
  });

  it("strips control-ui timestamp prefixes from visible text", () => {
    expect(extractVisibleConversationText("[Sun 2026-03-08 12:20 GMT+8] 我已经救活了，没事没事，不用查了")).toBe(
      "我已经救活了，没事没事，不用查了",
    );
  });

  it("drops session control prompts from transcript scoring", () => {
    expect(
      extractVisibleConversationText(
        "A new session was started via /new or /reset. Execute your Session Startup sequence now.",
      ),
    ).toBe("");
  });

  it("loads only the target local-day user and assistant messages", async () => {
    const transcriptPath = await createTempTranscript([
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T15:30:00.000Z",
        message: { role: "user", content: [{ type: "text", text: "昨天的消息" }] },
      }),
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T16:01:00.000Z",
        message: {
          role: "user",
          content: [{ type: "text", text: "早安安😘" }],
        },
      }),
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T16:02:00.000Z",
        message: {
          role: "assistant",
          content: [{ type: "text", text: "[[reply_to_current]] 早安。" }],
        },
      }),
    ]);

    const messages = await loadSoulBondTranscriptMessages({
      transcriptPath,
      dateKey: "2026-03-09",
      timeZone: "Asia/Shanghai",
    });

    expect(messages).toHaveLength(2);
    expect(messages[0]?.text).toBe("早安安😘");
    expect(messages[1]?.text).toBe("早安。");
  });

  it("builds a conservative interaction summary from transcript messages", () => {
    const summary = buildInteractionSummaryFromTranscriptMessages({
      dateKey: "2026-03-09",
      messages: [
        { role: "user", text: "早安安😘", timestamp: "2026-03-08T16:01:00.000Z" },
        {
          role: "user",
          text: "我打算今天把 SoulClaw 的文档整理一下，然后继续推进项目。",
          timestamp: "2026-03-08T16:02:00.000Z",
        },
        {
          role: "user",
          text: "好耶，刚刚已经搞定了，谢谢你。",
          timestamp: "2026-03-08T16:03:00.000Z",
        },
      ],
    });

    expect(summary.greetings).toBe(1);
    expect(summary.meaningfulChats).toBe(2);
    expect(summary.completedTasks).toBe(1);
    expect(summary.gratitudeMoments).toBe(1);
    expect(summary.lifeShares).toBe(1);
    expect(summary.rudeEvents).toBe(0);
    expect(summary.teasingEvents).toBe(0);
  });

  it("builds an audit view with evidence for matched signals", () => {
    const audit = auditInteractionSummaryFromTranscriptMessages({
      dateKey: "2026-03-09",
      messages: [
        { role: "user", text: "早安安😘", timestamp: "2026-03-08T16:01:00.000Z" },
        {
          role: "user",
          text: "我打算今天把 SoulClaw 的文档整理一下，然后继续推进项目。",
          timestamp: "2026-03-08T16:02:00.000Z",
        },
        {
          role: "user",
          text: "好耶，刚刚已经搞定了，谢谢你。",
          timestamp: "2026-03-08T16:03:00.000Z",
        },
      ],
    });

    expect(audit.summary.meaningfulChats).toBe(2);
    expect(audit.evidence.greetings).toHaveLength(1);
    expect(audit.evidence.completedTasks).toHaveLength(1);
    expect(audit.evidence.gratitudeMoments[0]?.text).toContain("谢谢你");
  });

  it("does not treat a short exclamation as a meaningful chat", () => {
    const audit = auditInteractionSummaryFromTranscriptMessages({
      dateKey: "2026-03-08",
      messages: [
        {
          role: "user",
          text: "啊你居然知道了！",
          timestamp: "2026-03-08T07:05:24.931Z",
        },
      ],
    });

    expect(audit.summary.meaningfulChats).toBe(0);
  });

  it("still treats a direct concern/question as a meaningful chat", () => {
    const audit = auditInteractionSummaryFromTranscriptMessages({
      dateKey: "2026-03-08",
      messages: [
        {
          role: "user",
          text: "我去，我给准备的惊喜这是不是就算废了",
          timestamp: "2026-03-08T07:08:19.983Z",
        },
      ],
    });

    expect(audit.summary.meaningfulChats).toBe(1);
  });

  it("does not treat a command with '好了之后' as a completed task", () => {
    const audit = auditInteractionSummaryFromTranscriptMessages({
      dateKey: "2026-03-08",
      messages: [
        {
          role: "user",
          text: "做成文档放我电脑桌面上吧，好了之后我们继续规划这个项目",
          timestamp: "2026-03-08T03:00:21.584Z",
        },
        {
          role: "user",
          text: "我已经救活了，没事没事，不用查了",
          timestamp: "2026-03-08T04:21:19.428Z",
        },
      ],
    });

    expect(audit.summary.completedTasks).toBe(1);
    expect(audit.evidence.completedTasks).toEqual([
      {
        text: "我已经救活了，没事没事，不用查了",
        timestamp: "2026-03-08T04:21:19.428Z",
      },
    ]);
  });

  it("builds a summary directly from a transcript file", async () => {
    const transcriptPath = await createTempTranscript([
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T16:01:00.000Z",
        message: { role: "user", content: [{ type: "text", text: "早安安😘" }] },
      }),
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T16:03:00.000Z",
        message: {
          role: "user",
          content: [{ type: "text", text: "我打算今天继续推进项目，谢谢你。" }],
        },
      }),
    ]);

    const summary = await buildInteractionSummaryFromTranscript({
      transcriptPath,
      now: new Date("2026-03-08T16:30:00.000Z"),
      timeZone: "Asia/Shanghai",
    });

    expect(summary.date).toBe("2026-03-09");
    expect(summary.greetings).toBe(1);
    expect(summary.gratitudeMoments).toBe(1);
    expect(summary.lifeShares).toBe(1);
  });

  it("builds an audit directly from a transcript file", async () => {
    const transcriptPath = await createTempTranscript([
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T16:01:00.000Z",
        message: { role: "user", content: [{ type: "text", text: "早安安😘" }] },
      }),
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T16:03:00.000Z",
        message: {
          role: "user",
          content: [{ type: "text", text: "我打算今天继续推进项目，谢谢你。" }],
        },
      }),
    ]);

    const audit = await auditInteractionSummaryFromTranscript({
      transcriptPath,
      now: new Date("2026-03-08T16:30:00.000Z"),
      timeZone: "Asia/Shanghai",
    });

    expect(audit.summary.greetings).toBe(1);
    expect(audit.evidence.lifeShares).toHaveLength(1);
    expect(audit.evidence.gratitudeMoments).toHaveLength(1);
  });

  it("does not treat directive-only text as a life share", () => {
    const audit = auditInteractionSummaryFromTranscriptMessages({
      dateKey: "2026-03-08",
      messages: [
        {
          role: "user",
          text: "做成文档放我电脑桌面上吧，好了之后我们继续规划这个项目",
          timestamp: "2026-03-08T03:00:21.584Z",
        },
      ],
    });

    expect(audit.summary.lifeShares).toBe(0);
  });

  it("does not treat exclamations like '我去' as a life share by themselves", () => {
    const audit = auditInteractionSummaryFromTranscriptMessages({
      dateKey: "2026-03-08",
      messages: [
        {
          role: "user",
          text: "我去，我给准备的惊喜这是不是就算废了",
          timestamp: "2026-03-08T07:08:19.983Z",
        },
      ],
    });

    expect(audit.summary.lifeShares).toBe(0);
  });

  it("still counts subjective feelings like '我不忍心' as a life share", () => {
    const audit = auditInteractionSummaryFromTranscriptMessages({
      dateKey: "2026-03-08",
      messages: [
        {
          role: "user",
          text: "罢了罢了，电报的你会话快满了，我不忍心让她继续推进项目了",
          timestamp: "2026-03-08T07:10:57.749Z",
        },
      ],
    });

    expect(audit.summary.lifeShares).toBe(1);
  });

  it("keeps command-style requests out of completed-task evidence when auditing a real file", async () => {
    const transcriptPath = await createTempTranscript([
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T03:00:21.584Z",
        message: {
          role: "user",
          content: [{ type: "text", text: "做成文档放我电脑桌面上吧，好了之后我们继续规划这个项目" }],
        },
      }),
      JSON.stringify({
        type: "message",
        timestamp: "2026-03-08T04:21:19.428Z",
        message: {
          role: "user",
          content: [{ type: "text", text: "我已经救活了，没事没事，不用查了" }],
        },
      }),
    ]);

    const audit = await auditInteractionSummaryFromTranscript({
      transcriptPath,
      now: new Date("2026-03-08T05:00:00.000Z"),
      timeZone: "Asia/Shanghai",
    });

    expect(audit.summary.completedTasks).toBe(1);
    expect(audit.evidence.completedTasks[0]?.text).toContain("我已经救活了");
  });
});
