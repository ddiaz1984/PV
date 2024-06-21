function emptyField($objeto){
  return (($objeto.val() == '') ? true : false);
}

function shake($objeto){
  /*$objeto.effect('shake', { // needs jQuery UI
      distance: 10,
      times: 1
  });*/
  $objeto.removeClass('success').addClass('error animated shake');
}

function validaEmail($objeto){
  var er = RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
  if(er.test($objeto.val()) == false){
      shake($objeto);
  }
}

function matchFields($objeto){
  var parentID = '#' + $objeto.attr('ID').replace('2', '');
  if ($(parentID).val() != $objeto.val()){
      shake($objeto);
  }
}

function valideKey(evt){

    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;

    if(code==8) { // backspace.
        return true;
    } else if(code>=48 && code<=57) { // is a number.
        return true;
    } else{ // other keys.
        return false;
    }
}

/*PRODUCTOS*/
function editarProducto(producto)
{
    $.ajax({
        url:"/productoEditar",
        type:"POST",
        data:{codigo:producto},
        success:function(data)
        {
          var obj = JSON.parse(data)

          $('#nombre1').val(obj[0]['nombre']);

          $('#listunidad1 > option').each(function(){

              if($(this).attr("data-value") == obj[0]['unidad'] ){

                  $("#unidad2").val($(this).attr("value"));

                  $('#unidad3').val(obj[0]['unidad']);
              }
          });

          $('#listcategoria1 > option').each(function(){

              if($(this).attr("data-value") == obj[0]['categoria'] ){

                  $("#categoria2").val($(this).attr("value"));

                  $('#categoria3').val(obj[0]['categoria']);
              }
          });

          $('#listmarca1 > option').each(function(){

              if($(this).attr("data-value") == obj[0]['marca'] ){

                  $("#marca2").val($(this).attr("value"));

                  $('#marca3').val(obj[0]['marca']);
              }
          });

          $('#cantidad1').val(obj[0]['cantidad']);
          $('#preciocompra1').val(obj[0]['preciocompra']);
          $('#precioventa1').val(obj[0]['precioventa']);

          $('#codigo').val(producto);

          $("#myModal1").modal("show");

        }
    });
}

function ConfirmDeleteProducto(cod)
{

    Swal.fire({
      title: 'Esta seguro ?',
      text: "Que desea eliminar el registro !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/productos/eliminar/"+cod;
      }
    })
}
