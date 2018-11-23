function draw_rect(rect, lineColor, lineWidth, fillColor = null) {
  stroke(lineColor);
  strokeWidth(lineWidth);
  rect(rect.x, rect.y, rect.w, rect.h);
}
