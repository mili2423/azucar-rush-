Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\public\img\logoNav.jpg"
if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$sizes = @(256, 128, 64, 48, 32, 16)
$pngBytesList = @()

$buildDir = Join-Path $PSScriptRoot "..\build"
if (-not (Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $sz, $sz
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, 0, 0, $sz, $sz)
    $g.Dispose()

    if ($sz -eq 256) {
        $pngPath = Join-Path $buildDir "icon.png"
        $bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytes = $ms.ToArray()
    $ms.Dispose()
    $bmp.Dispose()

    $pngBytesList += ,@($sz, $pngBytes)
}
$srcImg.Dispose()

# Build ICO binary
$msIco = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter $msIco

# Header: 2 bytes reserved (0), 2 bytes type (1 = ICO), 2 bytes count
$bw.Write([UInt16]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]$sizes.Count)

$headerSize = 6
$dirEntrySize = 16
$offset = $headerSize + ($dirEntrySize * $sizes.Count)

# Write Directory Entries
foreach ($item in $pngBytesList) {
    $sz = $item[0]
    $bytes = $item[1]

    $bWidth = if ($sz -eq 256) { [byte]0 } else { [byte]$sz }
    $bHeight = if ($sz -eq 256) { [byte]0 } else { [byte]$sz }

    $bw.Write($bWidth)
    $bw.Write($bHeight)
    $bw.Write([byte]0) # Color count
    $bw.Write([byte]0) # Reserved
    $bw.Write([UInt16]1) # Planes
    $bw.Write([UInt16]32) # Bit count
    $bw.Write([UInt32]$bytes.Length) # Bytes in image
    $bw.Write([UInt32]$offset) # Offset

    $offset += $bytes.Length
}

# Write PNG payloads
foreach ($item in $pngBytesList) {
    $bw.Write($item[1])
}

$bw.Flush()
$icoData = $msIco.ToArray()
$bw.Dispose()
$msIco.Dispose()

$buildIcoPath = Join-Path $buildDir "icon.ico"
$publicIcoPath = Join-Path $PSScriptRoot "..\public\img\icon.ico"

[System.IO.File]::WriteAllBytes($buildIcoPath, $icoData)
[System.IO.File]::WriteAllBytes($publicIcoPath, $icoData)

Write-Host "Generated ICO files successfully. Total size: $($icoData.Length) bytes"

