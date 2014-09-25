<nav role="navigation" class="navbar navbar-default navbar-top navbar-fixed-top">
<!-- START navbar header-->
<div class="navbar-header">
  <a href="${ctx}" class="navbar-brand">
    <div class="brand-logo">
      <img src="${imgRoot}/logo.png" alt="App Logo" class="img-responsive">
    </div>
    <div class="brand-logo-collapsed">
      <img src="${imgRoot}/logo-single.png" alt="App Logo" class="img-responsive">
    </div>
  </a>
</div>
<!-- END navbar header-->
<!-- START Nav wrapper-->
<div class="nav-wrapper">
<!-- START Left navbar-->
<ul class="nav navbar-nav">
  <li>
    <!-- Button used to collapse the left sidebar. Only visible on tablet and desktops-->
    <a href="#" data-toggle-state="aside-collapsed" class="hidden-xs">
      <em class="fa fa-navicon"></em>
    </a>
    <!-- Button to show/hide the sidebar on mobile. Visible on mobile only.-->
    <a href="#" data-toggle-state="aside-toggled" class="visible-xs">
      <em class="fa fa-navicon"></em>
    </a>
  </li>
  <!-- START User avatar toggle-->
  <li>
    <!-- Button used to collapse the left sidebar. Only visible on tablet and desktops-->
    <a href="#" data-toggle-state="aside-user">
      <em class="fa fa-user"></em>
    </a>
  </li>
  <!-- END User avatar toggle-->
</ul>
<!-- END Left navbar-->
<!-- START Right Navbar-->
<ul class="nav navbar-nav navbar-right">
  <!-- Fullscreen-->
  <li>
    <a href="#" data-toggle="fullscreen">
      <em class="fa fa-expand"></em>
    </a>
  </li>
  <!-- START Alert menu-->
  <li class="dropdown dropdown-list">
    <a href="#" data-toggle="dropdown" data-play="flipInX" class="dropdown-toggle">
      <em class="fa fa-bell"></em>
      <div class="label label-danger">11</div>
    </a>
    <!-- START Dropdown menu-->
    <ul class="dropdown-menu">
      <li>
        <!-- START list group-->
        <div class="list-group">
          <!-- list item-->
          <a href="#" class="list-group-item">
            <div class="media">
              <div class="pull-left">
                <em class="fa fa-twitter fa-2x text-info"></em>
              </div>
              <div class="media-body clearfix">
                <p class="m0">New followers</p>
                <p class="m0 text-muted">
                  <small>1 new follower</small>
                </p>
              </div>
            </div>
          </a>
          <!-- list item-->
          <a href="#" class="list-group-item">
            <div class="media">
              <div class="pull-left">
                <em class="fa fa-envelope fa-2x text-warning"></em>
              </div>
              <div class="media-body clearfix">
                <p class="m0">New e-mails</p>
                <p class="m0 text-muted">
                  <small>You have 10 new emails</small>
                </p>
              </div>
            </div>
          </a>
          <!-- list item-->
          <a href="#" class="list-group-item">
            <div class="media">
              <div class="pull-left">
                <em class="fa fa-tasks fa-2x text-success"></em>
              </div>
              <div class="media-body clearfix">
                <p class="m0">Pending Tasks</p>
                <p class="m0 text-muted">
                  <small>11 pending task</small>
                </p>
              </div>
            </div>
          </a>
          <!-- last list item -->
          <a href="#" class="list-group-item">
            <small>More notifications</small>
            <span class="label label-danger pull-right">14</span>
          </a>
        </div>
        <!-- END list group-->
      </li>
    </ul>
    <!-- END Dropdown menu-->
  </li>
  <!-- END Alert menu-->

</ul>
<!-- END Right Navbar-->
</div>
<!-- END Nav wrapper-->

</nav>