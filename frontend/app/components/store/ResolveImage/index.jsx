const ResolveImage = (image, type = null) => {
  if (type) {
    switch (type) {
      case 'ticket':
        return '/assets/ticket-icon.png';
      case 'coupon':
        return '/assets/ticket-icon.png';
      default:
        break;
    }
  }
  const defaultImage = type === 'profile' ? '/assets/profile-icon.png' : '/assets/placeholder.PNG';
  return image && image.trim() !== '' ? image : defaultImage;
};

export default ResolveImage;
