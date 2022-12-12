import { Context, SQSEvent, SQSBatchResponse } from "aws-lambda";
import Downloader from "nodejs-file-downloader";

export const handler = async (
  event: SQSEvent,
  _: Context
): Promise<SQSBatchResponse> => {
  console.log(event);
  const failed = [];

  for (const record of event.Records) {
    const { url }: { url: string } = JSON.parse(record.body);
    if (!url) {
      failed.push({ itemIdentifier: record.messageId, reason: "NO_URL" });
      continue;
    }

    const downloader = new Downloader({
      url,
      directory: "/tmp",
    });

    try {
      const { filePath } = await downloader.download();
      console.log(`downloaded ${filePath}`);
    } catch (error) {
      console.error("Download failed", error);
      failed.push({
        itemIdentifier: record.messageId,
        reason: "FAILED_DOWNLOAD",
      });
    }

    await downloader.download();
  }

  if (failed.length) console.error(failed.toString());
  return {
    batchItemFailures: failed.map(({ itemIdentifier }) => ({ itemIdentifier })),
  };
};
