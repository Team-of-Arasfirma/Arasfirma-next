// backend/services/crmService.js

// Server-only service.
// Never log credentials.
// Never expose CRM auth to frontend.
//
// Confirmed CRM body format:
// [
//   {
//     "Name": "Customer Name",
//     "Phone Number": "+919876543210",
//     "Email": "customer@gmail.com",
//     "Priority": null,
//     "City": "Customer City",
//     "Source": "MANUAL"
//   }
// ]

const SUCCESS_STATUS_CODES = [200, 201, 202];
const DUPLICATE_STATUS_CODES = [409];

const readOptionalResponse = async (response) => {
  if (!response.body) return {};

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let text = "";
  let bytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    bytes += value.byteLength;

    if (bytes > 65536) {
      await reader.cancel();
      return {};
    }

    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();

  try {
    return text.trim() ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

const readErrorResponse = async (response) => {
  try {
    const text = await response.text();
    return text ? text.slice(0, 300) : "";
  } catch {
    return "";
  }
};

const extractLeadId = (data) => {
  const id =
    data?.leadId ??
    data?.lead_id ??
    data?.data?.leadId ??
    data?.data?.lead_id ??
    data?.lead?._id ??
    data?.data?._id ??
    data?._id ??
    data?.id ??
    data?.fields?._id ??
    data?.fields?.id;

  return typeof id === "string" || typeof id === "number" ? String(id) : "";
};

export const syncInquiryToCrm = async (inquiry) => {
  if (process.env.CRM_SYNC_ENABLED !== "true") {
    return {
      success: false,
      skipped: true,
      error: "CRM sync disabled",
    };
  }

  const { CRM_WEBHOOK_URL, CRM_USERNAME, CRM_AUTH } = process.env;

  if (
    !CRM_WEBHOOK_URL ||
    !CRM_USERNAME ||
    !CRM_AUTH ||
    ["<put-auth-token-here>", "<auth-token-here>"].includes(CRM_AUTH)
  ) {
    return {
      success: false,
      error: "CRM configuration is incomplete",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const url = new URL(CRM_WEBHOOK_URL);

    if (url.protocol !== "https:") {
      return {
        success: false,
        error: "CRM webhook must use HTTPS",
      };
    }

    const phone = inquiry.phone || inquiry.mobile || "";

    const payload = [
      {
        Name: inquiry.name || "",
        "Phone Number": phone,
        Email: inquiry.email || "",
        Priority: null,
        City: inquiry.city || "Not Provided",
        Source: "MANUAL",
      },
    ];

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: CRM_USERNAME,
        auth: CRM_AUTH,
      },
      redirect: "error",
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    if (SUCCESS_STATUS_CODES.includes(response.status)) {
      const data = await readOptionalResponse(response);
      const leadId = extractLeadId(data);

      return {
        success: true,
        leadId: leadId.includes(CRM_AUTH) ? "" : leadId.slice(0, 256),
      };
    }

    if (DUPLICATE_STATUS_CODES.includes(response.status)) {
      await response.body?.cancel();

      return {
        success: true,
        leadId: "",
        duplicate: true,
        message: "CRM lead already exists",
      };
    }

    const errorText = await readErrorResponse(response);

    return {
      success: false,
      error: `CRM returned HTTP ${response.status}${
        errorText ? `: ${errorText}` : ""
      }`,
    };
  } catch (error) {
    return {
      success: false,
      error: controller.signal.aborted
        ? "CRM request timed out"
        : "CRM request failed",
    };
  } finally {
    clearTimeout(timeout);
  }
};