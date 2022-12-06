export default function setHeader(
  header:
    | {
      autherization?: string;
      contentType?: string;
    }
    | undefined
): object {
  return {
    Accept: "*/*",
    "Content-Type": header?.contentType || "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:3333",
    "Access-Control-Allow-Credentials": "true",
  };
}
