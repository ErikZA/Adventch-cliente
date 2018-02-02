import { AdventechClientPage } from './app.po';

describe('adventech-client App', function() {
  let page: AdventechClientPage;

  beforeEach(() => {
    page = new AdventechClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
