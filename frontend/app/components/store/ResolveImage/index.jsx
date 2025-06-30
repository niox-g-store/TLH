const ResolveImage = (type = null, image) => {
  if (type) {
    switch (type) {
      case 'ticket':
        return '/assets/ticket-icon.png';
      default:
        break;
    }
  }
  const defaultImage = '/assets/placeholder.PNG';
  return image && image.trim() !== '' ? image : defaultImage;
};

export default ResolveImage;
