class PagesService {
  createPagesArrayFromLimitNumber(limit: number) {
    const pages = [];
    const tratedLimit = limit || 1;

    for (let i = 1; i <= tratedLimit; i += 1) {
      pages.push(i);
    }

    return pages;
  }
}

export {
  PagesService,
};
