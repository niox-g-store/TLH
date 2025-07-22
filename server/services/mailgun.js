const formData = require('form-data');
const Mailgun = require('mailgun.js');
const template = require('../config/template');
const keys = require('../config/keys');

const { key, domain, host, sender, support, mailingKey } = keys.mailgun;
const { order, security, auth, news, management, domain_unsubscribe } = keys.mailgun;

class MailgunService {
  constructor() {
    this.mailgun = this.init();
    this.mailingG = this.mailingSetup()
  }

  mailingSetup() { // mailing list setup
    try {
      const mg = new Mailgun(formData);
      return mg.client({
        username: 'api',
        key: mailingKey,
      })
    } catch (error) {
      throw error
    }
  }

  init() {  // normal call here
    try {
      const mg = new Mailgun(formData);
      return mg.client({
        username: 'api',
        key: key,
      });
    } catch (error) {
      console.warn('Missing Mailgun keys');
    }
  }

  async getAnalyticsData() {
    try {
      let params = {
        event: 'opened',
        limit: 300,
      };

      let allEvents = [];
      let nextPageUrl = null;

      let response = await this.mailgun.events.get(domain, params);

      allEvents = allEvents.concat(response.items);

      while (response.pages && response.items.length > 0 && response.pages.next) {
        nextPageUrl = response.pages.next.page;
        params.page = nextPageUrl
  
        response = await this.mailgun.events.get(domain, params);
  
        allEvents = allEvents.concat(response.items);
      }
  
      const totalOpens = allEvents.length;
  
      return {
        totalOpens,
      };
    } catch (error) {
      throw error;
    }
  }

  async createMailingList(address) {
    try {
      const trimmedAddress = address.trim().replace(/\s/g, '');
      this.mailingG.lists.create({
        address: `${trimmedAddress}@thelinkhangout.com`,
        name: trimmedAddress,
        description: `Mailing lists for organizer ${trimmedAddress}`,
        access_level: 'readonly',
        reply_preference: 'list',
      })
    } catch(error) {
      console.error('cannot fetch mailing list:', error);
      throw error;
    }
  }

  async destroyMailingList(address) {
    try {
      const trimmedAddress = address.trim().replace(/\s/g, '');
      this.mailingG.lists.destroy(`${trimmedAddress}@thelinkhangout.com`);
    } catch(error) {
      console.error(`Cannot destroy mailing list`, error);
    }
  }
  
  
  async fetchMembers() { // fetch member from mailing list
    try {
      const result = await this.mailingG.lists.members.listMembers(news);
      const tempRes = []
      if (result.items.length > 0) {
        for (const member of result.items) {
          tempRes.push(member.address)
        }
      }
      return tempRes
    } catch (error) {
      console.error('cannot fetch mailing list:', error);
      throw error;
    }
  }

  async getMailingListDetails() {  // get mailing list details
    try {
      let result = await this.mailingG.lists.members.listMembers(news);
      const tempRes = []
      if (result.items.length > 0) {
        for (const member of result.items) {
          if (member.subscribed) {
            tempRes.push(member)
          }
        }
      }
      let allEvents = tempRes;
      let nextPageUrl = null;

      while (result.pages && result.items.length > 0 && result.pages.next) {
        nextPageUrl = result.pages.next.page;
  
        result = await this.mailingG.lists.members.listMembers(news, {page: nextPageUrl});
  
        allEvents = allEvents.concat(result.items);
      }
      const totalOpens = allEvents.length;
      return totalOpens
    } catch (error) {
      console.error('cannot fetch mailing list:', error);
      throw error;
    }
  }

  async getMailingListMembersCount() {  // get mailing list members count
    try {
      const result = await this.mailingG.lists.get(news);
      if (result) {
        return result.members_count
      }
    } catch (error) {
      throw error
    }
  }

  async createMember(email, name){ // create a member to a mailing list
    try {
      const cBase = Buffer.from(email).toString('base64');
      const result = await this.mailingG.lists.members.createMember(news, {
        address: email,
        name,
        subscribed: true,
        upsert: "yes",
        vars: {
          unsubscribe_link: `${domain_unsubscribe}/${cBase}`,
          name: name,
        },
      })
      return result
    } catch (error) {
      console.error('Failed to add member to mailing list:', error);
      throw error;
    }
  }

  async createMembers(address, eventMembers) {  // create members to a mailing list
    try {
      const trimmedAddress = address.trim().replace(/\s/g, '');
      const members = [];
      for (let sendTo of eventMembers) {
        const cBase = Buffer.from(sendTo.email).toString('base64');
        members.append({
          address: sendTo.email,
          name: sendTo.name,
          subscribed: true,
          upsert: "yes",
          vars: {
            unsubscribe_link: `${domain_unsubscribe}/${cBase}`,
            name: sendTo.name
          }
        })
      }
      const result = await this.mailingG.lists.members.createMembers(
        `${trimmedAddress}@thelinkhangout.com`,
        {
          members: members,
          upsert: "yes"
        }
      )
      return result
    } catch (error) {
      console.error('Failed to add members to mailing list:', error);
      throw error;
    }
  }

  async updateMember(email, value) {  // update memeber in a mailing list
    try {
      const keys = Object.keys(value)
      let query = {}

      for (const k of keys) {
        query = {
          [k]: value[k]
        }
      }
      const update = await this.mailingG.lists.members.updateMember(news, email, query)
      if (update) {
        return true
      }
    } catch(error) {
      throw 'Cannot update member'
    }
  }

  async destroyMember(email) {  // delete member from a mailing list
    try {
      const result = await this.mailingG.lists.members.destroyMember(news, email)
      return result
    } catch (error) {
      console.error('Failed to delete member from mailing list', error);
      throw error;
    }
  }

  async sendEmail(email, type, data, attachment = null, hostName) {  // send email
    try {
      const message = prepareTemplate(type, host, data);

      let config;

      /*if (type === 'admin-contact') {
        config = {
          from: sender,
          to: support,
          "h:Reply-To": email,
          subject: `Support ticket from ${data[0]}`,
          text: data[1],
          html: data[1]
        }*/
      if (attachment) {
        config = {
          from: `The Link Hangouts <${message.sender}>`,
          to: email,
          subject: message.subject,
          text: message.text,
          html: message.html,
          attachment: attachment.map((pdf) => ({
            data: pdf.data,
            filename: pdf.filename,
            contentType: pdf.contentType
          }))
        };
      } else {
        let from = null
        if (type === 'newsletter-reminder') {
          from = `${hostName} <${email}>`
        } else {
          from = `The Link Hangouts <${message.sender}>`
        }
        config = {
          from,
          to: email,
          subject: message.subject,
          text: message.text,
          html: message.html,
        };
      }


      let result = null;
      if (type === 'newsletter' || type === 'newsletter-reminder') {
        result = await this.mailingG.messages.create(domain, config);
      } else {
        result = await this.mailgun.messages.create(domain, config);
      }
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}


const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case 'newsletter':
      message = template.newsLetterEmail(data);
      message.sender = news;
      break;
      
    case 'newsletter-reminder':
      message = template.newsLetterEmail(data);
      break;

    case 'reset':
      message = template.resetEmail(host, data)
      message.sender = security;
      break;

    case 'reset-confirmation':
      message = template.confirmResetPasswordEmail();
      message.sender = security;
      break;

    case 'signin':
      message = template.signinEmail(data);
      message.sender = security;
      break;

    case 'signup':
      message = template.signupEmail(data);
      message.sender = management;
      break;

    case 'organizer-signup':
      message = template.organizerSignup(data);
      message.sender = management;
      break;

    case 'newsletter-subscription':
      message = template.newsletterSubscriptionEmail();
      message.sender = news;
      break;

    case 'organizer-suspend-account':
      message = template.organizerSuspendAccount(data, support);
      message.sender = management;
      break;

    case 'organizer-resume-account':
      message = template.organizerResumeAccount(data, support);
      message.sender = management;
      break;

    case 'organizer-banned-account':
      message = template.organizerDeactivateAccount(data, support);
      message.sender = management;
      break;

    case 'order-confirmation':
      message = template.orderConfirmationEmail(data);
      message.sender = order;
      break;

    case 'admin-order-confirmation':
      message = template.adminOrderConfirmationEmail(data);
      message.sender = order;
      break;

    case 'organizer-order-confirmation':
      message = template.organizerOrderConfirmationEmail(data);
      message.sender = order;
      break;

    case 'product-order-confirmation':
      message = template.productOrderConfirmationEmail(data);
      message.sender = order;
      break;
      
    case 'ticket-check-in':
      message = template.ticketCheckin(data.userName, data.eventName, data.ticketCode, data.scannedAt);
      message.sender = sender
      break;
      
    default:
      message = '';
  }

  return message;
};


const mailgunService = new MailgunService();
module.exports = mailgunService;
