$(document).ready(function(){
    var $product_in_car =$('#in_car');
    $('.add_car').click(function(e){
        e.preventDefault();

        var $tr= $(this).parents('tr');
        var $product_pk = $tr.attr('product-pk');
        var $product_name = $tr.find('.product_name').text();
        var $button = $(this);
        $.post('/car-add-product/',{'product_pk':$product_pk},function(response){
            if(response.success){
                $product_in_car.append(`<li product-pk="${$product_pk}">${$product_name}</li>`);
                $tr.addClass('info');
                $button.attr('disabled',true);
            }else{
                alert(response.message);
            }
        })
    });

    $product_in_car.find('li').each(function(){
        var product_pk = $(this).attr('product-pk');
        $tr = $('.products').find('[product-pk='+product_pk+']')
        $tr.find('.add_car').attr('disabled',true);
        $tr.addClass('info');
    });


    // USED IN UPDATE ORDER
    $('.remove_product').click(function(e){
        e.preventDefault();
        var $tr= $(this).parents('tr');
        var $product_pk = $tr.attr('product-pk');
        $.post('/car-remove-product/',{'product_pk':$product_pk},function(response){
            if(response.success){
                $tr.fadeOut();
            }else{
                alert(response.message);
            }
        })
    });

    $('.update-quantity').focusout(function(e){
        e.preventDefault();
        var $generateServiceOrder = $('#generateServiceOrder');
        $generateServiceOrder.attr('disabled','disabled');
        var $tr= $(this).parents('tr');
        var $product_pk = $tr.attr('product-pk');
        var $product_price = $tr.attr('product-price');
        var $td_product_total = $tr.find('.product-total');

        var $table = $($tr.parents('table'));
        var $tr_summary = $table.find('.summary');
        var $summary_quantity = $tr_summary.find('.quantity');
        var $summary_total = $tr_summary.find('.total');

        var quantity = $(this).val();
        if($.isNumeric(quantity) && quantity>0 && quantity%1==0){
            $.post('/car-update-product/',{'product_pk':$product_pk, 'quantity':quantity},function(response){
                if(response.success){
                    $generateServiceOrder.removeAttr('disabled');
                    $td_product_total.text(parseFloat(quantity)*parseFloat($product_price));

                    var qt = 0, tt=0;
                    $table.find('.item').each(function(){
                        var q = $(this).find('.update-quantity').val();
                        var t = $(this).find('.product-total').text();

                        qt += parseFloat(q);
                        tt += parseFloat(t);
                    });



                    $summary_quantity.text(qt);
                    $summary_total.text(tt);

                }else{
                    alert(response.message);
                }
            });
        }else{
            $(this).val('')
            $(this).focus();
        }
    });

});