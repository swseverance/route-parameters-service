import { RouteParametersServicePage } from './app.po';

describe('route-parameters-service App', () => {
  let page: RouteParametersServicePage;

  beforeEach(() => {
    page = new RouteParametersServicePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
