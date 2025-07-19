const resolveImage = (image, type = null) => {
  if (type) {
    switch (type) {
      case 'ticket':
        return '/assets/ticket-icon.png';
      case 'coupon':
        return '/assets/ticket-icon.png';
      case 'profile':
        if (image === 'http://localhost:3030/apiundefined' || image === 'http://localhost:3030/api') {
          return '/assets/profile-icon.png';
        }
      default:
        break;
    }
  }
  const defaultImage = '/assets/placeholder.PNG';
  return image && image.trim() !== '' ? image : defaultImage;
};

export default resolveImage;
