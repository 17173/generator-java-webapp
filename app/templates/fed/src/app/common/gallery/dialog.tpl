<div class="tab-content" data-role="panes">
  <div class="tab-pane fade" data-role="pane" id="gallery-dialog-browse">
    <form class="form-inline" action method="get" role="form">
      <div class="form-group">
        <select class="form-control" name="userUploaded">
          <option value="true">我上传的</option>
          <option value="false">全部</option>
        </select>
        <input type="text" class="form-control" name="name" size="11" placeholder="图片名称">
      </div>

      <div class="form-group">
        <select class="form-control" name="type">
          <option value="1">宽</option>
          <option value="2">高</option>
        </select>
        <input type="number" class="form-control input-number" min="1" name="min" size="5" placeholder="最小值">
        -
        <input type="number" class="form-control input-number" min="1" name="max" size="5" placeholder="最大值">
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-default"><i class="fa fa-search"></i> 搜索</button>
      </div>
    </form>
  </div>
  <div class="tab-pane fade" data-role="pane" id="gallery-dialog-upload"></div>
</div>
