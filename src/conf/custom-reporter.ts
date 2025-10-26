import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import dotenv from 'dotenv';
import { parse } from "path";
dotenv.config();

export default class CustomReporter implements Reporter {
    totalTest: number = 0; // Tổng số test trong suite

    // Lưu số test theo status result
    totalPassed: number = 0;
    totalFailed: number = 0;
    totalSkipped: number = 0;
    totalTimeOut: number = 0;
    totalInterrupt: number = 0;

    // Lưu danh sách các test theo status result (title + duration)
    passedCase: string[] = [];
    failedCase: string[] = [];
    skippedCase: string[] = [];
    timeoutCase: string[] = [];
    interruptCase: string[] = [];

    content: string[] = []; // Lưu các dòng report cuối cùng

    async onBegin(config: FullConfig, suite: Suite): Promise<void> {
        this.totalTest = suite.allTests().length;
    }

    async onTestBegin(test: TestCase): Promise<void> {
    }

    onTestEnd(test: TestCase, result: TestResult): void {

        switch (result.status) {
            case "passed":
                this.totalPassed++;
                this.passedCase.push(`${test.title} (${(result.duration / 1000).toFixed(2)}s)`);
                break;

            case "failed":
                this.totalFailed++;
                this.failedCase.push(`${test.title} (${(result.duration / 1000).toFixed(2)}s)`);
                break;

            case "timedOut":
                this.totalTimeOut++;
                this.timeoutCase.push(`${test.title} (${(result.duration / 1000).toFixed(2)}s)`);
                break;
        }
    }

    // Report
    async onEnd(result: FullResult): Promise<void> {
        const reportingTime = new Date(Date.now()).toLocaleString();

        this.content.push(`Reporting time: ${reportingTime}`);
        this.content.push(`Total tests: ${this.totalTest}`);

        // Failed
        const failedRate = ((this.totalFailed / this.totalTest) * 100).toFixed(2);
        this.content.push(`Failed tests: ${this.totalFailed}/${this.totalTest} (${failedRate}%)`);
        this.failedCase.forEach(f => this.content.push(`- ${f}`));

        // Passed
        const passedRate = ((this.totalPassed / this.totalTest) * 100).toFixed(2);
        this.content.push(`Passed tests: ${this.totalPassed}/${this.totalTest} (${passedRate}%)`);

        // Timeout
        const timeoutRate = ((this.totalTimeOut / this.totalTest) * 100).toFixed(2);
        this.content.push(`Timed out tests: ${this.totalTimeOut}/${this.totalTest} (${timeoutRate}%)`);

        console.log(this.content.join("\n"));

        // Send report to Discord
        const bodyDiscord = {
            "content": this.content.join("\n"),
        };

        const bodyStrDiscord = JSON.stringify(bodyDiscord);

        const webhookDiscord = process.env.DISCORD_WEBHOOK_URL as string;
        console.log("Discord Webhook URL:", webhookDiscord);

        const responseDiscord = await fetch(webhookDiscord, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyStrDiscord,
        });

        // Send report to Slack
        const bodySlack = {
            "text": this.content.join("\n"),
        };

        const bodyStrSlack = JSON.stringify(bodySlack);

        const webhookSlack = process.env.SLACK_WEBHOOK_URL as string;
        console.log("Slack Webhook URL:", webhookSlack);

        const responseSlack = await fetch(webhookSlack, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyStrSlack,

        });

        // Send report to Telegram
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN as string;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID as string;
        const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        const bodyTelegram = {
            chat_id: telegramChatId,
            text: this.content.join("\n"),
            parse_mode: "Markdown",
        };

        const responseTelegram = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyTelegram),
        });
        console.log("Telegram response:", responseTelegram)
    }
}