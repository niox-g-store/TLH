const ResolveImage = (image, type = null) => {
  if (type === 'profile' && (image === 'http://localhost:3030/apiundefined' || image === 'http://localhost:3030/api')) {
    return '/assets/profile-icon.png'
  }
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
  const defaultImage = '/assets/placeholder.PNG';
  return image && image.trim() !== '' ? image : defaultImage;
};

export default ResolveImage;
