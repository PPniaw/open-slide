import { useLocale } from '@/lib/use-locale';

// Kept here instead of the shared locale files so these fork-only screens
// don't touch files upstream edits every release.
const ZH = {
  connectTitle: '選一個 AI 幫你做簡報',
  connectDescription: '用你自己的帳號登入。第一次使用要先下載，之後打開就能直接用。',
  codexName: 'ChatGPT',
  codexNote: '免費方案就能用，額度比較少。',
  claudeName: 'Claude',
  claudeNote: '需要 Claude Pro 或 Max 方案。',
  download: '下載（約 {size}）',
  downloading: '下載中 {percent}%',
  downloadPreparing: '準備下載…',
  login: '登入',
  loginStarting: '正在打開登入頁…',
  loginWaiting: '瀏覽器已打開登入頁，登入完成後這裡會自動接上。',
  loginFallback: '瀏覽器沒有打開？點這裡',
  loginCodeLabel: '如果頁面給你一串代碼，貼在這裡：',
  loginCodeSubmit: '送出',
  loginCancel: '取消',
  use: '使用這個',
  inUse: '使用中',
  logout: '登出',
  loggedOutHint: '還沒登入，或登入已經過期。',
  failed: '沒有成功：',
  errorAuthTitle: '請先登入',
  errorAuthBody: 'AI 還沒登入或登入已過期。請按「登入」重新登入，完成後再送一次。',
  errorQuotaTitle: '免費額度用完了',
  errorQuotaBody:
    '這個 AI 帳號的使用額度暫時用完了，通常過幾個小時會恢復。可以等一下再試，或換另一個 AI。',
  errorNetworkTitle: '網路連線中斷',
  errorNetworkBody: '請確認網路正常，再送一次訊息。',
  errorOtherTitle: '出了點問題',
  details: '技術細節',
  notice: '提醒：',
};

const EN: typeof ZH = {
  connectTitle: 'Pick an AI to build your slides',
  connectDescription:
    'Sign in with your own account. The first time it downloads once; after that it opens straight away.',
  codexName: 'ChatGPT',
  codexNote: 'Works on the free plan, with a smaller allowance.',
  claudeName: 'Claude',
  claudeNote: 'Needs a Claude Pro or Max plan.',
  download: 'Download (about {size})',
  downloading: 'Downloading {percent}%',
  downloadPreparing: 'Preparing download…',
  login: 'Sign in',
  loginStarting: 'Opening the sign-in page…',
  loginWaiting:
    'The sign-in page is open in your browser; this connects by itself once you finish.',
  loginFallback: "Browser didn't open? Click here",
  loginCodeLabel: 'If the page gives you a code, paste it here:',
  loginCodeSubmit: 'Send',
  loginCancel: 'Cancel',
  use: 'Use this',
  inUse: 'In use',
  logout: 'Sign out',
  loggedOutHint: 'Not signed in, or the sign-in expired.',
  failed: 'That did not work: ',
  errorAuthTitle: 'Sign in first',
  errorAuthBody:
    'The AI is not signed in or the sign-in expired. Press Sign in, then send the message again.',
  errorQuotaTitle: 'The allowance is used up',
  errorQuotaBody:
    "This AI account's allowance is used up for now and usually comes back within a few hours. Try again later or switch to the other AI.",
  errorNetworkTitle: 'The connection dropped',
  errorNetworkBody: 'Check the network, then send the message again.',
  errorOtherTitle: 'Something went wrong',
  details: 'Technical details',
  notice: 'Note: ',
};

export function useAgentForkStrings() {
  return useLocale().id.startsWith('zh') ? ZH : EN;
}
