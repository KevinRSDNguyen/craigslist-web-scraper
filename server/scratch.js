var results = $("li.result-row");

results.each((index, element) => {
  const result = $(element);
  // data-ids="1:00r0r_gd8xnL1aVMx,1:00606_itkxGQR4XpX,1:01313_83rswFxnnKQ"
  let hood = result.find(".result-hood").text();

  console.log(hood);
});
