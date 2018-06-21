import { LearningAngularPage } from './app.po';

describe('learning-angular App', function() {
  let page: LearningAngularPage;

  beforeEach(() => {
    page = new LearningAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
