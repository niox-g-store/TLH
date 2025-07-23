const ShowCampaignTemplate = (props) => {
  const { campaign } = props;
  const templateContent = campaignTemplate(campaign);

  return (
    <iframe
      title="Campaign Template Preview"
      style={{
        width: '100%',
        height: '500px',
        border: 'none'
      }}
      srcDoc={templateContent}
    />
  );
};