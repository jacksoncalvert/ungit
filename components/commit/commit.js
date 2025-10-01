const ko = require('knockout');
const md5 = require('blueimp-md5');
const moment = require('moment');
const octicons = require('octicons');
const components = require('ungit-components');

components.register('commit', (args) => new CommitViewModel(args));

class CommitViewModel {
  constructor(gitNode) {
    this.graph = gitNode.graph;
    this.repoPath = gitNode.graph.repoPath;
    this.sha1 = gitNode.sha1;
    this.server = gitNode.graph.server;
    this.highlighted = gitNode.highlighted;
    this.nodeIsMousehover = gitNode.nodeIsMousehover;
    this.selected = gitNode.selected;
    this.pgpVerifiedString = gitNode.pgpVerifiedString;
    this.pgpIcon = octicons.verified.toSVG({ height: 18 });
    this.nodeCy = gitNode.cy; // Store reference to node's y-position
    this.element = ko.observable();
    this.message = ko.observable();
    this.title = ko.observable();
    this.body = ko.observable();
    this.authorDate = ko.observable();
    this.authorDateFromNow = ko.observable();
    this.authorName = ko.observable();
    this.authorEmail = ko.observable();
    this.fileLineDiffs = ko.observable();
    this.numberOfAddedLines = ko.observable();
    this.numberOfRemovedLines = ko.observable();
    this.parents = ko.observable();
    this.authorGravatar = ko.computed(() => md5((this.authorEmail() || '').trim().toLowerCase()));

    this.showCommitDiff = ko.computed(
      () => this.fileLineDiffs() && this.fileLineDiffs().length > 0
    );

    this.diffStyle = ko.computed(() => {
      // Position diff as a right-side pane aligned with the git node
      if (this.selected() && this.nodeCy) {
        // Use the node's cy position directly - it's the SVG coordinate
        // Add offset to account for the graph container position
        const nodeYPosition = this.nodeCy() + 30; // 30px is the top offset of the graph container
        const topPosition = Math.max(nodeYPosition, 80); // Ensure it doesn't go above the header
        return { 
          position: 'fixed',
          right: '20px',
          top: `${topPosition}px`,
          width: '600px',
          'max-height': `calc(100vh - ${topPosition + 20}px)`,
          'overflow-y': 'auto',
          'z-index': '1000'
        };
      }
      else return {};
    });
  }

  updateNode(parentElement) {
    ko.renderTemplate('commit', this, {}, parentElement);
  }

  setData(args) {
    const message = args.message.split('\n');
    this.message(args.message);
    this.title(message[0]);
    this.body(message.slice(message[1] ? 1 : 2).join('\n'));
    this.authorDate(moment(new Date(args.authorDate)));
    this.authorDateFromNow(this.authorDate().fromNow());
    this.authorName(args.authorName);
    this.authorEmail(args.authorEmail);
    this.numberOfAddedLines(args.additions);
    this.numberOfRemovedLines(args.deletions);
    this.parents(args.parents || []);
    this.fileLineDiffs(args.fileLineDiffs);
    this.commitDiff = ko.observable(
      components.create('commitDiff', {
        fileLineDiffs: this.fileLineDiffs(),
        sha1: this.sha1,
        repoPath: this.repoPath,
        server: this.server,
        showDiffButtons: this.selected,
      })
    );
  }

  updateLastAuthorDateFromNow(deltaT) {
    this.lastUpdatedAuthorDateFromNow = this.lastUpdatedAuthorDateFromNow || 0;
    this.lastUpdatedAuthorDateFromNow += deltaT;
    if (this.lastUpdatedAuthorDateFromNow > 60 * 1000) {
      this.lastUpdatedAuthorDateFromNow = 0;
      this.authorDateFromNow(this.authorDate().fromNow());
    }
  }

  updateAnimationFrame(deltaT) {
    this.updateLastAuthorDateFromNow(deltaT);
  }

  stopClickPropagation(data, event) {
    event.stopImmediatePropagation();
  }

  copyHash() {
    navigator.clipboard.writeText(this.sha1);
  }

  gotoCommit(sha1) {
    const node = this.graph.nodesById[sha1];
    if (node) {
      node.toggleSelected();
    }
  }
}
