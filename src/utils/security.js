// src/utils/security.js
// Anti-fraud payout account uniqueness checks

export function isPayoutAccountTakenByOther(accountNumber, currentUserId, state) {
  if (!accountNumber) return false;
  const normalized = String(accountNumber).replace(/\s+/g, '');

  // Search withdrawals for any matching account already assigned to a different user
  const foundInWithdrawals = (state.withdrawals || []).find(w => {
    if (!w || !w.account) return false;
    const account = String(w.account).replace(/\s+/g, '');
    const ownerId = w.userId || w.user || null;
    return account === normalized && ownerId && ownerId !== currentUserId;
  });

  // You can extend this search to other persisted sources (deposits metadata etc.)
  if (foundInWithdrawals) return true;

  return false;
}

export function ensureUniquePayoutAccount(accountNumber, currentUserId, state) {
  if (isPayoutAccountTakenByOther(accountNumber, currentUserId, state)) {
    const err = new Error('Yeh EasyPaisa/JazzCash account pehle se kisi aur account mein register hai!');
    err.code = 'DUPLICATE_PAYOUT_ACCOUNT';
    throw err;
  }
  return true;
}
