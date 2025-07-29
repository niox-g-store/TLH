const formatCountdown = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
        return "Now";
    }

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    let countdownString = "";
    if (days > 0) countdownString += `${days}d `;
    if (hours > 0) countdownString += `${hours}h `;
    if (minutes > 0) countdownString += `${minutes}m `;
    countdownString += `${seconds}s`;

    return countdownString.trim();
};

export default formatCountdown;
